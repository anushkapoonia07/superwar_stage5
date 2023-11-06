const PLAYERS = [
  'Spiderman',
  'Captain America',
  'Wonderwoman',
  'Popcorn',
  'Gemwoman',
  'Bolt',
  'Antwoman',
  'Mask',
  'Tiger',
  'Captain',
  'Catwoman',
  'Fish',
  'Hulk',
  'Ninja',
  'Black Cat',
  'Volverine',
  'Thor',
  'Slayer',
  'Vader',
  'Slingo',
];

// Player Class
class Player {
  constructor(id, name, type) {
    this.id = id;
    this.name = name;
    this.image = 'images/super-' + (id + 1) + '.png';
    this.strength = this.getRandomStrength();
    this.type = type;
    this.selected = false;
    this.wins = 0;
  }

  // Get random strength
  getRandomStrength = () => {
    return Math.ceil(Math.random() * 100);
  };

  // Create a player for displaying
  view = () => {
    let players = document.createElement('div');
    players.classList.add('player');
    players.setAttribute('data-id', this.id);
    if (this.selected == true) players.classList.add('selected');
    let images = document.createElement('img');
    images.setAttribute('src', this.image);
    let Name = document.createElement('div');
    Name.textContent = this.name;
    let strengths = document.createElement('div');
    strengths.textContent = this.strength;
    strengths.className = 'strength';
    players.append(images, Name, strengths);
    return players;
  };
}

// Superwar Class
class Superwar {
  constructor(player) {
    this.players = player.map((player, i) => {
      let type = i % 2 == 0 ? 'hero' : 'villain';
      return new Player(i, player, type);
    });
    this.score = { hero: 0, villain: 0 };
    this.strength = { hero: 0, villain: 0 };
    this.wins = { hero: 0, villain: 0 };
    Array.from(document.getElementsByClassName('team')).forEach((elem) =>
      elem.addEventListener('click', (e) => {
        this.handleSelection(e.target);
      })
    );
  }

  // Display players in HTML
  viewPlayers = () => {
    let Teams = document.getElementById('heroes');
    Teams.innerHTML = '';
    let Fragments = this.buildPlayers('hero');
    Teams.append(Fragments);

    Teams = document.getElementById('villains');
    Teams.innerHTML = '';
    Fragments = this.buildPlayers('villain');
    Teams.append(Fragments);
  };

  // Build players fragment
  buildPlayers = (type) => {
    let Fragments = document.createDocumentFragment();
    this.filterPlayers(type).forEach((player) =>
      Fragments.append(player.view())
    );
    return Fragments;
  };

  // Filter Players based on type
  filterPlayers = (type) => {
    return this.players.filter((player) => player.type == type);
  };

  // Handle player clicks
  handleSelection = (Target) => {
    if (!Target.classList.contains('player')) Target = Target.parentNode;
    if (!Target.hasAttribute('data-id')) return;

    let selectedid = Target.getAttribute('data-id');
    let selectedplayer = this.players[selectedid];
    this.players
      .filter((player) => player.type == selectedplayer.type)
      .forEach((player) => (player.selected = false));
    selectedplayer.selected = true;

    if (this.isFight() === 'clash') this.fight();
    else this.viewPlayers();
  };

  // Progression 1: Check for fight
  isFight = () => {
    if (strength > 0) {
      return 'clash';
    } else {
      return 'peace';
    }
  };
  fight = () => {
    let Scores= this.calculateScore();
    let finalscore = document.getElementById('score');
    finalscore.innerHTML = '1 - 0';
    if (this.checkWin() !== 'endure')
      setTimeout(() => this.announceWinner(Scores), 100);
    return finalscore;
  };

  // Progression 2: Calculate score
  calculateScore = () => {
    let setWinner = this.updateWin();
    let score = this.score;
    this.players.map((player) => {
      if (player.type == 'hero') {
        player.win = setWinner['hero'];
        score['hero'] += player.wins;
      } else {
        player.win = setWinner['villain'];
        score['villain'] += player.wins;
      }
    });
    return score;
  };

  // Progression 3: Check whether there is a win
  checkWin = () => {
    let output = 'endure';
    let health = {
      hero: this.totalStrength('hero'),
      villain: this.totalStrength('villain'),
    };

    output =
      health['hero'] > health['villain']
        ? 'hero'
        : health['hero'] == health['villain']
        ? 'endure'
        : 'villain';
    return output;
  };

  updateWin = () => {
    let win = { hero: 0, villain: 0, draw: 0 };
    let winner = this.checkWin();
    if (winner == 'hero') {
      win['hero'] += 1;
    } else if (winner == 'villain') {
      win['villain'] += 1;
    } else {
      win['draw'] += 1;
    }
    return win;
  };

  // Progression 4: Find total strength of a team
  totalStrength = (type) => {
    let Strength = this.strength;
    this.players.map((player) => {
      if (player.type == 'hero') {
        Strength['hero'] += player.strength;
      } else {
        Strength['villain'] += player.strength;
      }
    });
    return Strength[type];
  };

  // Announce the winner
  announceWinner = (score) => {
    console.log(score['hero']);
    if (score['hero'] == score['villain']) alert('Its a draw!');
    else if (score['hero'] > score['villain']) alert('Heroes Win!');
    else alert('Villains Win!');
    location.reload();
  };
}

window.onload = () => {
  const superwars= new Superwar(PLAYERS);
  superwars.viewPlayers();
};
