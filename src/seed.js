const { sequelize, Campaign, Character, Session } = require('./models');

async function seedDatabase() {
  try {
    await sequelize.sync({ force: true });

    const campaigns = await Campaign.bulkCreate([
      {
        name: 'Lost Mines of Phandelver',
        description: 'A classic starter campaign focused on exploration, goblins, and uncovering hidden threats in Phandalin.',
        setting: 'Forgotten Realms'
      },
      {
        name: 'Curse of Strahd',
        description: 'A gothic horror campaign set in the mist-shrouded land of Barovia.',
        setting: 'Barovia'
      },
      {
        name: 'Homebrew: The Shattered Isles',
        description: 'A custom sea-faring adventure involving ancient magic, political conflict, and dangerous ruins.',
        setting: 'The Shattered Isles'
      }
    ], { returning: true });

    const [phandelver, strahd, isles] = campaigns;

    await Character.bulkCreate([
      {
        name: 'Thamior',
        characterClass: 'Wizard',
        race: 'High Elf',
        level: 3,
        notes: 'Curious scholar who records every magical detail.',
        campaignId: phandelver.id
      },
      {
        name: 'Brom',
        characterClass: 'Fighter',
        race: 'Human',
        level: 4,
        notes: 'Former soldier protecting the group on the road.',
        campaignId: phandelver.id
      },
      {
        name: 'Elira',
        characterClass: 'Cleric',
        race: 'Half-Elf',
        level: 5,
        notes: 'Dedicated to healing and uncovering the truth behind Barovia.',
        campaignId: strahd.id
      },
      {
        name: 'Kael',
        characterClass: 'Rogue',
        race: 'Human',
        level: 4,
        notes: 'Careful scout with a habit of checking every locked door.',
        campaignId: strahd.id
      },
      {
        name: 'Seren',
        characterClass: 'Druid',
        race: 'Tiefling',
        level: 6,
        notes: 'Protects the balance of the islands and reads the sea currents.',
        campaignId: isles.id
      }
    ]);

    await Session.bulkCreate([
      {
        sessionDate: '2026-04-01',
        summary: 'The party arrived in Phandalin, met local townsfolk, and learned about trouble near the mines.',
        nextSteps: 'Investigate the goblin trail outside town.',
        campaignId: phandelver.id
      },
      {
        sessionDate: '2026-04-08',
        summary: 'The group explored the Cragmaw hideout and rescued a captured merchant.',
        nextSteps: 'Track the missing supplies and question the merchant.',
        campaignId: phandelver.id
      },
      {
        sessionDate: '2026-04-02',
        summary: 'The adventurers entered Barovia and were greeted by eerie silence and heavy fog.',
        nextSteps: 'Reach the village and learn more about the castle.',
        campaignId: strahd.id
      },
      {
        sessionDate: '2026-04-09',
        summary: 'The party met the Vistani and discovered unsettling rumors about the Count.',
        nextSteps: 'Search for allies who can resist Strahd.',
        campaignId: strahd.id
      },
      {
        sessionDate: '2026-04-03',
        summary: 'The crew charted a course to a sunken ruin and recovered a strange glass key from the wreckage.',
        nextSteps: 'Decode the key and locate the matching seal.',
        campaignId: isles.id
      }
    ]);

    console.log('Database seeded successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
