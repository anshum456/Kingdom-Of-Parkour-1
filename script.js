function preload() {
  this.load.image("knight", "https://i.imgur.com/cnKW8ly.png");
  
  this.load.image("floor", "https://i.imgur.com/Vklqhtl.png");
  this.load.image("platformsThatGoUp", "https://i.imgur.com/M2WnWBM.png");
  this.load.image("platformsThatGoDown", "https://i.imgur.com/4vPjy3q.png");
  this.load.image("mudCrystal", "https://i.imgur.com/nboih5L.png");
  this.load.image("mudDrop", "https://i.imgur.com/5mCiDME.png");
  this.load.image("Mudom", "https://i.imgur.com/YRxysAd.png");
  this.load.image("mudBomb", "https://i.imgur.com/1Gd1OX7.png");
  this.load.image("mukPlatform", "https://i.imgur.com/7eENJbX.png");
  this.load.image("mukDownPlatform", "https://i.imgur.com/RzeN6bR.png");
  this.load.image("mukFloor", "https://i.imgur.com/kEtDfHK.png");
  this.load.image("Grimmy", "https://i.imgur.com/DYTzwMg.png");
  this.load.image("SPIKES", "https://i.imgur.com/OjPFwAp.png");
  this.load.audio(
    "medievalMusic",
    "https://res.cloudinary.com/aqjh9tmm/video/upload/v1791011564/kiravale-medieval-music-593694_3.mp3",
  );
  this.load.image("coins", "https://i.imgur.com/tXBciHB.png");
  this.load.image("grassOfPeace", "https://i.imgur.com/F02M3wX.png")
  this.load.image("wiseOldTree", "https://i.imgur.com/MVUDg27.png")
  this.load.image("donkeyReward", "https://i.imgur.com/zCbYUjN.png")
}

function create() {
  let bgm = this.sound.add("medievalMusic");
  bgm.play({
    loop: true,
    volume: 0.1, // Adjust volume between 0 and 1
  });

  this.physics.world.setBounds(0, 0, 576000, 4000);
  this.cameras.main.setBounds(0, 0, 576000, 4000);

  

  this.player = this.physics.add.sprite(50, 600, "knight").setScale(3);
  this.player.setCollideWorldBounds(true);
  this.player.health = 5;

  this.player.body.setSize(18, 26); // Shrinks the physics box to ignore empty pixels
  this.player.body.setOffset(7, 6);

  this.player.body.setMaxVelocity(800, 2000); // Prevents gravity from pushing him too deep on high falls
  this.player.body.setFriction(0, 0);

  this.cameras.main.startFollow(this.player);

  this.player.setBounce(0.1);



  this.floorGroup = this.physics.add.staticGroup();

  for (let i = 0; i < 3348; i++) {
    this.floorGroup
      .create(i * 64 + 16, 700, "floor")
      .setScale(3)
      .refreshBody();
  }

  let coins = this.physics.add.staticGroup();

  for (let platforms = 0; platforms < 486; platforms++) {
    let platform = this.physics.add
      .staticImage(1400 + platforms * 496, 360, "platformsThatGoDown")
      .setScale(3);
    platform.refreshBody();

    this.physics.add.collider(this.player, platform);

    if (Math.random() > 0.5) {
      let coin = coins
        .create(1400 + platforms * 496, 230, "coins")
        .setScale(0.5);
      coin.refreshBody();
    }
  }

  this.physics.add.overlap(this.player, coins, collectCoin, null, this);

  for (let upPlatforms = 0; upPlatforms < 486; upPlatforms++) {
    let platform7 = this.physics.add
      .staticImage(1600 + upPlatforms * 496, 300, "platformsThatGoUp")
      .setScale(3);
    platform7.refreshBody();

    this.physics.add.collider(this.player, platform7);

    if (Math.random() > 0.5) {
      let coin = coins
        .create(1600 + upPlatforms * 496, 200, "coins")
        .setScale(0.5);
      coin.refreshBody();
    }
  }

  this.physics.add.overlap(this.player, coins, collectCoin, null, this);

  for (let mudCrystals = 0; mudCrystals < 144; mudCrystals++) {
    let mudCrystal1 = this.add
      .image(2000 + mudCrystals * 2000, 610, "mudCrystal")
      .setScale(2);
  }

  this.waterfall = this.add
    .tileSprite(7000, 250, 128, 500, "mudDrop")
    .setScale(2);
  this.waterfall.setTileScale(0.4, 0.4);

  this.mudom = this.physics.add.sprite(288000, 300, "Mudom");
  this.mudom.setScale(5);
  this.mudom.setCollideWorldBounds(true);
  this.mudom.health = 10;

  this.physics.add.collider(this.mudom, this.floorGroup);

  this.invisibleWall = this.physics.add.staticSprite(288200, 400, "floor");

  // 2. Scale it vertically by 50x to make it completely un-jumpable!
  this.invisibleWall.setScale(2, 50);
  this.invisibleWall.refreshBody();

  // 3. Keep it hidden from the player
  this.invisibleWall.setVisible(false);

  // 4. Force the player to collide with it
  this.wallCollider = this.physics.add.collider(
    this.player,
    this.invisibleWall,
  );


this.bossStarted = false;
this.mudBombsThrown = 0;
this.mudBomb = null;

this.mudom.setInteractive();

this.mudom.clicksTaken = 0;

this.mudom.on("pointerdown", () => {
  if (this.mudom.health > 0) {
    this.mudom.clicksTaken++;

    this.mudom.health -= 5;

    console.log(`Mudom was clicked! Health left: ${this.mudom.health}`);

    this.mudom.setTint(0xff5555);

    this.time.delayedCall(1500, () => {
      if (this.mudom && this.mudom.active) {
        this.mudom.clearTint();
      }
    });

    if (this.mudom.clicksTaken >= 2 || this.mudom.health <= 0) {
      this.defeatMudom("Defeated by the Knight's blows!");

      if (this.wallCollider) {
        this.physics.world.removeCollider(this.wallCollider);
        console.log("The massive wall has vanished! Path cleared.");
      }

      this.mudom.destroy();
    }
  }
});

this.physics.add.collider(this.player, this.floorGroup);

this.mukFloorGroup = this.physics.add.staticGroup();

for (let mukFloor = 0; mukFloor < 866; mukFloor++) {
  this.mukFloorGroup
    .create(288100 + (mukFloor * 64 + 16), 700, "mukFloor")
    .setScale(1)
    .refreshBody();
}

for (let mukPlatforms = 0; mukPlatforms < 486; mukPlatforms++) {
  let mukPlatform = this.physics.add
    .staticImage(288100 + mukPlatforms * 496, 360, "mukPlatform")
    .setScale(1);
  mukPlatform.refreshBody();

  this.physics.add.collider(this.player, mukPlatform);

  if (Math.random() > 0.3) {
    let coin = coins
      .create(288100 + mukPlatforms * 496, 200, "coins")
      .setScale(0.5);
    coin.refreshBody();
  }
}

this.physics.add.overlap(this.player, coins, collectCoin, null, this);

for (let downMukPlatforms = 0; downMukPlatforms < 140; downMukPlatforms++) {
  let mukPlatform7 = this.physics.add
    .staticImage(288100 + downMukPlatforms * 496, 300, "mukDownPlatform")
    .setScale(1);
  mukPlatform7.refreshBody();

  this.physics.add.collider(this.player, mukPlatform7);

  if (Math.random() > 0.3) {
    let coin = coins
      .create(288100 + downMukPlatforms * 496, 200, "coins")
      .setScale(0.5);
    coin.refreshBody();
  }
}

this.physics.add.overlap(this.player, coins, collectCoin, null, this);
this.physics.add.collider(this.player, this.mukFloorGroup);

this.grimmy = this.physics.add.sprite(576000, 300, "Grimmy");
this.grimmy.setScale(3);
this.grimmy.setCollideWorldBounds(true);
this.grimmy.health = 20;

this.physics.add.collider(this.grimmy, this.floorGroup);

this.grimmyBossStarted = false;
this.grimmy.setInteractive();

this.grimmy.clicksTaken = 0;

this.grimmy.on("pointerdown", () => {
  // Only register hits if Grimmy is alive
  if (this.grimmy.health > 0) {
    this.grimmy.clicksTaken++;

    // 5 damage per click = 4 clicks to defeat
    this.grimmy.health -= 5;

    console.log(`Grimmy was clicked! Health left: ${this.grimmy.health}`);

    // Visual hit flash
    this.grimmy.setTint(0xff5555);

    this.time.delayedCall(500, () => {
      if (this.grimmy && this.grimmy.active) {
        this.grimmy.clearTint();
      }
    });

    // Defeated after 4 clicks
    if (this.grimmy.clicksTaken >= 4 || this.grimmy.health <= 0) {
      this.grimmy.destroy();

      console.log("Grimmy was defeated!");
    }
  }
});

this.add.image(720000, 525, "wiseOldTree").setScale(2);
  

this.grassFloorGroup = this.physics.add.staticGroup();

for (let grassFloor = 0; grassFloor < 433; grassFloor++) {
  this.mukFloorGroup
    .create(576100 + (grassFloor * 64 + 16), 700, "grassOfPeace")
    .setScale(0.8)
    .refreshBody();
}

this.physics.add.collider(this.player, this.grassFloorGroup)

this.rewardSpawned = false

this.add.text(
  100,
  200,
  "How to Play: use arrows or WASD and defeat bosses with clicks!",
  {
    fontFamily: "Comic Sans MS",
    fontSize: "32px",
    fill: "#ff3300",
  },
);

this.add.text(200, 300, "KINGDOM OF PARKOUR: MUDDY HOLLOWS", {
  fontFamily: "Comic Sans MS",
  fontSize: "32px",
  fill: "#442200",
});

this.add.text(
  287000,
  100,
  "BEWARE OF MUDOM, MUD BOMB THROWING MENANCE, AVOID THE BOMBS!",
  {
    fontFamily: "AR CARTER",
    fontSize: "32px",
    fill: "#990001",
  },
);

this.add.text(
  574000,
  100,
  "BEWARE OF GRIMMY, SPIKE PUNCTURING MENANCE, JUMP THE SPIKES!",
  {
    fontFamily: "AR CARTER",
    fontSize: "32px",
    fill: "#990001",
  },
);

const platform1 = this.physics.add
  .staticImage(200, 600, "platformsThatGoUp")
  .setScale(3)
  .refreshBody();
const platform2 = this.physics.add
  .staticImage(400, 540, "platformsThatGoUp")
  .setScale(3)
  .refreshBody();
const platform3 = this.physics.add
  .staticImage(600, 480, "platformsThatGoUp")
  .setScale(3)
  .refreshBody();
const platform4 = this.physics.add
  .staticImage(800, 420, "platformsThatGoUp")
  .setScale(3)
  .refreshBody();
const platform5 = this.physics.add
  .staticImage(1000, 360, "platformsThatGoUp")
  .setScale(3)
  .refreshBody();
const platform6 = this.physics.add
  .staticImage(1200, 300, "platformsThatGoUp")
  .setScale(3)
  .refreshBody();

this.physics.add.collider(this.player, platform1);
this.physics.add.collider(this.player, platform2);
this.physics.add.collider(this.player, platform3);
this.physics.add.collider(this.player, platform4);
this.physics.add.collider(this.player, platform5);
this.physics.add.collider(this.player, platform6);

this.cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (this.player.x >= 287930 && !this.bossStarted) {
    this.bossStarted = true;

    // 1. Create a group for the bombs (Put this BEFORE the timer event)
    this.mudBombsGroup = this.physics.add.group();

    // 2. Set up the collider ONCE for the whole group
    this.physics.add.collider(
      this.player,
      this.mudBombsGroup,
      (player, bomb) => {
        bomb.destroy(); // Remove the mud bomb instantly
        player.health -= 1; // Take away 1 health point

        if (player.health <= 0) {
          player.body.enable = false; // Stop the player
          this.time.delayedCall(1000, () => {
            this.scene.restart(); // Restart level after 1 second
          });
        }
      },
    );

    // 3. Run your attack timer loop
    this.time.addEvent({
      delay: 1000,
      repeat: 4,
      callback: () => {
        const mudBomb = this.mudBombsGroup.create(
          this.mudom.x,
          this.mudom.y,
          "mudBomb",
        );

        const angle = Phaser.Math.Angle.Between(
          this.mudom.x,
          this.mudom.y,
          this.player.x,
          this.player.y,
        );

        this.physics.velocityFromRotation(
          angle,
          250, // Pro-tip: Raised speed to 250 so it feels more like a dangerous boss attack!
          mudBomb.body.velocity,
        );

        this.mudBombsThrown++;
      },
    });
  }

  if (this.player.x >= 575000 && !this.grimmyBossStarted) {
    this.grimmyBossStarted = true;

    // 1. Create a group for Grimmy's rising spikes
    this.spikesGroup = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    // 2. Set up the overlap for damage
    this.physics.add.overlap(this.player, this.spikesGroup, (player, spike) => {
      // The knight only gets punctured if the spike is actively moving up or fully extended
      if (spike.getData("isActive")) {
        spike.destroy();
        player.health -= 1;

        if (player.health <= 0) {
          player.body.enable = false;
          this.time.delayedCall(1000, () => {
            this.scene.restart();
          });
        }
      }
    });

    // 3. Grimmy's puncture attack loop
    this.time.addEvent({
      delay: 2000, // Slightly more time between spikes to match the telegraph
      repeat: 499,
      callback: () => {
        const targetX = this.player.x;
        // Determine the actual floor surface line
        const floorLine = this.grimmy.y + this.grimmy.displayHeight / 2;

        // Spawn the spike HIDDEN just below the floor line
        const spike = this.spikesGroup.create(
          targetX,
          floorLine + 40,
          "SPIKES",
        );
        spike.setOrigin(0.5, 1); // Ground origin

        // STEP 1: Telegraphing/Warning Phase
        // Keep it hidden below ground, but flash a red warning tint on the floor dirt
        spike.setTint(0xff3333);
        spike.setAlpha(0.3);
        spike.setData("isActive", false);

        // STEP 2: The Puncture (Dodge window ends after 500ms)
        this.time.delayedCall(500, () => {
          if (spike && spike.active) {
            spike.setAlpha(1.0);
            spike.clearTint(); // Return to normal colors
            spike.setData("isActive", true); // Now lethal!

            // Shoot the spike upward out of the dirt rapidly
            spike.body.setVelocityY(-400);

            // STEP 3: Stop the spike once it has fully extended
            this.time.delayedCall(100, () => {
              if (spike && spike.active) {
                spike.body.setVelocityY(0); // Stop rising

                // STEP 4: Retract and clean up after 800ms
                this.time.delayedCall(800, () => {
                  if (spike && spike.active) {
                    spike.body.setVelocityY(200); // Sink back down
                    this.time.delayedCall(200, () => {
                      if (spike && spike.active) spike.destroy();
                    });
                  }
                });
              }
            });
          }
        });
      },
    });
  }

  if (this.player.x >= 710000 && this.rewardSpawned === false) {
    
    // Spawn donkey!
    this.add.image(710000, 300, "donkeyReward");

    this.add.text(710000, 160, "THERE IS STILL A MISSION, TAKE THE DONKEY FOR HELPING YOU IN THE NEXT GAME", {
      fontFamily: "AR CARTER",
      fontSize: "32px",
      fill: "#5d4acd"
    })
    
    // Flip the switch to TRUE so this code never triggers again
    this.rewardSpawned = true;
}

  // === FIXED ANIMATION AND MOVEMENT TIMELINE STARTS HERE ===
  if (this.cursors.right.isDown) {
    this.player.setVelocityX(160); // Moves right
    this.player.setFlipX(false); // Faces right naturally
    
  } else if (this.cursors.left.isDown) {
    this.player.setVelocityX(-160); // Goes left
    this.player.setFlipX(true); // Flips the knight to face left!
    
  } else {
    this.player.setVelocityX(0); // Stops moving when keys are let go
    
  }

  if (this.cursors.up.isDown && this.player.body.touching.down) {
    this.player.setVelocityY(-260); // This makes them jump cleanly!
  }

  this.waterfall.tilePositionY -= 4;
}

function collectCoin(player, coin) {
  // Instantly hides the coin and deletes its physics body
  coin.disableBody(true, true);
}

const config = {
  type: Phaser.AUTO,
  height: 4000,
  width: 1400,
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  fps: {
    target: 60,
    forceSetTimeOut: true,
  },

  scene: {
    create,
    preload,
    update,
  },
};

new Phaser.Game(config)