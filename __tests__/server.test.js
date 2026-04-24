const request = require('supertest');
const app = require('../server');

// Mock global fetch for all server tests
const mockFetch = jest.fn();
global.fetch = mockFetch;

function geminiOk(text) {
  return Promise.resolve({
    json: () => Promise.resolve({
      candidates: [{ content: { parts: [{ text }] } }],
    }),
  });
}

function geminiEmpty() {
  return Promise.resolve({ json: () => Promise.resolve({ candidates: [] }) });
}

beforeEach(() => mockFetch.mockReset());

describe('POST /api/claude', () => {
  test('returns text from Gemini on valid prompt', async () => {
    mockFetch.mockReturnValueOnce(geminiOk('Hello there!'));
    const res = await request(app)
      .post('/api/claude')
      .send({ prompt: 'Say hello' });
    expect(res.status).toBe(200);
    expect(res.body.text).toBe('Hello there!');
  });

  test('forwards the prompt to Gemini in the correct shape', async () => {
    mockFetch.mockReturnValueOnce(geminiOk('ok'));
    await request(app).post('/api/claude').send({ prompt: 'test prompt' });
    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.contents[0].role).toBe('user');
    expect(body.contents[0].parts[0].text).toBe('test prompt');
  });

  test('returns 400 when prompt is missing', async () => {
    const res = await request(app).post('/api/claude').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('prompt required');
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test('returns 400 when body is empty', async () => {
    const res = await request(app).post('/api/claude').send();
    expect(res.status).toBe(400);
  });

  test('returns 500 when Gemini returns no candidates', async () => {
    mockFetch.mockReturnValueOnce(geminiEmpty());
    const res = await request(app).post('/api/claude').send({ prompt: 'hi' });
    expect(res.status).toBe(500);
    expect(res.body.error).toMatch(/empty response/i);
  });

  test('returns 500 when fetch throws a network error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network failure'));
    const res = await request(app).post('/api/claude').send({ prompt: 'hi' });
    expect(res.status).toBe(500);
    expect(res.body.error).toBe('Network failure');
  });
});

describe('Static file serving', () => {
  test('GET / serves index.html', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/html/);
    expect(res.text).toContain('Hail Mary');
  });

  test('GET /styles.css serves the stylesheet', async () => {
    const res = await request(app).get('/styles.css');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/css/);
  });

  test('GET /nonexistent returns 404', async () => {
    const res = await request(app).get('/this-does-not-exist.html');
    expect(res.status).toBe(404);
  });
});
