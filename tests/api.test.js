process.env.DB_STORAGE = ':memory:';

const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

test('POST /campaigns creates a campaign', async () => {
  const response = await request(app).post('/campaigns').send({
    name: 'Lost Mines of Phandelver',
    description: 'A starter D&D campaign',
    setting: 'Forgotten Realms'
  });

  expect(response.status).toBe(201);
  expect(response.body.id).toBeDefined();
  expect(response.body.name).toBe('Lost Mines of Phandelver');
});

test('POST /characters creates a character linked to a campaign', async () => {
  const campaignResponse = await request(app).post('/campaigns').send({
    name: 'Curse of Strahd',
    description: 'Dark gothic adventure',
    setting: 'Barovia'
  });

  const characterResponse = await request(app).post('/characters').send({
    name: 'Aelar',
    characterClass: 'Wizard',
    race: 'Elf',
    level: 3,
    notes: 'Likes old books',
    campaignId: campaignResponse.body.id
  });

  expect(characterResponse.status).toBe(201);
  expect(characterResponse.body.name).toBe('Aelar');
  expect(characterResponse.body.campaignId).toBe(campaignResponse.body.id);
});

test('POST /sessions creates a session linked to a campaign', async () => {
  const campaignResponse = await request(app).post('/campaigns').send({
    name: 'Homebrew Adventure',
    description: 'Original story',
    setting: 'My World'
  });

  const sessionResponse = await request(app).post('/sessions').send({
    sessionDate: '2026-04-12',
    summary: 'The party entered the ruined tower and found a secret door.',
    nextSteps: 'Explore the lower chambers',
    campaignId: campaignResponse.body.id
  });

  expect(sessionResponse.status).toBe(201);
  expect(sessionResponse.body.summary).toContain('secret door');
});

test('GET /campaigns returns a list', async () => {
  await request(app).post('/campaigns').send({
    name: 'Test Campaign',
    description: 'Testing list endpoint',
    setting: 'Testland'
  });

  const response = await request(app).get('/campaigns');
  expect(response.status).toBe(200);
  expect(Array.isArray(response.body)).toBe(true);
});

test('DELETE /campaigns removes a campaign', async () => {
  const createResponse = await request(app).post('/campaigns').send({
    name: 'Delete Me',
    description: 'This campaign will be deleted',
    setting: 'Temporary'
  });

  const deleteResponse = await request(app).delete(`/campaigns/${createResponse.body.id}`);
  expect(deleteResponse.status).toBe(204);

  const getResponse = await request(app).get(`/campaigns/${createResponse.body.id}`);
  expect(getResponse.status).toBe(404);
});