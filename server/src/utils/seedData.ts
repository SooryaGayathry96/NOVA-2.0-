import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Module } from '../models/Module';
import { Mission } from '../models/Mission';
import { Quiz } from '../models/Quiz';
import { Achievement } from '../models/Achievement';
import { UserProgress } from '../models/UserProgress';
import { UserAchievement } from '../models/UserAchievement';
import { QuizAttempt } from '../models/QuizAttempt';

export const seedDatabase = async () => {
  const existingModulesCount = await Module.countDocuments();
  if (existingModulesCount > 0) {
    console.log('[NOVA 2.O Database] Seed data already present. Skipping initial seed.');
    return;
  }

  console.log('[NOVA 2.O Database] Seeding initial modules, missions, quizzes, and achievements...');

  // 1. Create Achievements
  const achievements = await Achievement.create([
    {
      code: 'FIRST_MISSION',
      title: 'First Flight',
      description: 'Successfully completed your first astronaut training mission!',
      icon: 'rocket',
      category: 'Missions',
      xpRequirement: 50,
      conditionType: 'first_mission',
      conditionValue: 1,
      badgeColor: 'blue',
    },
    {
      code: 'SPACE_EXPLORER',
      title: 'Cosmic Scholar',
      description: 'Completed 3 space learning academy modules.',
      icon: 'book-open',
      category: 'Academics',
      xpRequirement: 75,
      conditionType: 'modules_count',
      conditionValue: 3,
      badgeColor: 'cyan',
    },
    {
      code: 'GRAVITY_EXPERT',
      title: 'Gravity Master',
      description: 'Mastered microgravity mechanics in Zero-G training.',
      icon: 'orbit',
      category: 'Special',
      xpRequirement: 100,
      conditionType: 'missions_count',
      conditionValue: 2,
      badgeColor: 'purple',
    },
    {
      code: 'QUIZ_CHAMPION',
      title: 'Quiz Champion',
      description: 'Scored 100% on any scientific astronaut knowledge quiz!',
      icon: 'award',
      category: 'Academics',
      xpRequirement: 150,
      conditionType: 'quiz_score',
      conditionValue: 100,
      badgeColor: 'gold',
    },
    {
      code: 'MISSION_MASTER',
      title: 'Mission Veteran',
      description: 'Completed at least 4 demanding space training missions.',
      icon: 'shield-check',
      category: 'Missions',
      xpRequirement: 200,
      conditionType: 'missions_count',
      conditionValue: 4,
      badgeColor: 'emerald',
    },
    {
      code: 'STELLAR_COMMANDER',
      title: 'Stellar Commander',
      description: 'Accumulated 1200+ XP and earned senior astronaut status.',
      icon: 'crown',
      category: 'Milestone',
      xpRequirement: 300,
      conditionType: 'total_xp',
      conditionValue: 1200,
      badgeColor: 'amber',
    },
  ]);

  // 2. Create 10 Educational Learning Modules (Section 5.3)
  const modules = await Module.create([
    {
      order: 1,
      title: 'Introduction to Space',
      category: 'Space Science',
      description: 'Discover where Earth ends and space begins: the Kármán line, atmospheric layers, and the cosmic vacuum.',
      readTimeMinutes: 5,
      xpReward: 60,
      content: [
        {
          heading: 'Where Does Space Begin?',
          body: 'The universally recognized boundary between Earth and outer space is the Kármán line, located approximately 100 kilometers (62 miles) above mean sea level. At this altitude, Earth’s atmosphere becomes so thin that standard aerodynamic flight is no longer possible without reaching orbital velocities.',
          facts: [
            'The Kármán Line is named after physicist Theodore von Kármán.',
            'Above 100 km, 99.999% of Earth’s atmosphere lies beneath you.',
            'Space is not an empty void; it is a vacuum filled with low-density particles, magnetic fields, and cosmic radiation.'
          ],
          illustrationKey: 'karman-line'
        },
        {
          heading: 'The Near-Vacuum Environment',
          body: 'In outer space, pressure is nearly zero. Without atmospheric pressure, liquids boil at body temperature, and sound cannot travel because there are no air molecules to vibrate. This is why astronauts wear pressurized Extravehicular Mobility Units (EMUs).',
          facts: [
            'Sound needs a physical medium like gas or liquid to propagate; in space, nobody can hear sound waves.',
            'Temperatures in space range from +120°C in direct sunlight to -150°C in the shade.'
          ],
          illustrationKey: 'vacuum'
        }
      ]
    },
    {
      order: 2,
      title: 'The Solar System',
      category: 'Solar System',
      description: 'Journey across our cosmic neighborhood: from the blazing Sun to the Kuiper belt and the Oort cloud.',
      readTimeMinutes: 6,
      xpReward: 60,
      content: [
        {
          heading: 'Our Star: The Sun',
          body: 'The Sun contains 99.86% of all mass in our solar system! Its gravitational pull holds eight planets, five dwarf planets, and millions of asteroids and comets in orbital harmony. Inside its core, nuclear fusion turns hydrogen into helium at 15 million degrees Celsius.',
          facts: [
            'Light from the Sun takes roughly 8 minutes and 20 seconds to reach Earth.',
            'Over 1.3 million Earths could fit inside the volume of the Sun.'
          ],
          illustrationKey: 'sun-fusion'
        },
        {
          heading: 'The Inner & Outer Realms',
          body: 'The Solar System is divided into rocky terrestrial planets (Mercury, Venus, Earth, Mars) and gas/ice giants (Jupiter, Saturn, Uranus, Neptune), separated by the main Asteroid Belt between Mars and Jupiter.',
          facts: [
            'Jupiter is more than twice as massive as all other planets combined.',
            'The Asteroid Belt contains Ceres, the largest asteroid and a recognized dwarf planet.'
          ],
          illustrationKey: 'solar-realms'
        }
      ]
    },
    {
      order: 3,
      title: 'Planets and Moons',
      category: 'Solar System',
      description: 'Explore the diverse geology, volcanic moons, subsurface oceans, and extreme weather of our planetary neighbors.',
      readTimeMinutes: 7,
      xpReward: 70,
      content: [
        {
          heading: 'Extreme Worlds',
          body: 'Venus has a runaway greenhouse effect making its surface 465°C—hot enough to melt lead! Mars has Olympus Mons, the largest volcano in the solar system, three times taller than Mount Everest.',
          facts: [
            'A day on Venus (243 Earth days) is longer than its year (225 Earth days).',
            'Mars has iron oxide (rust) on its surface, giving it its iconic red hue.'
          ],
          illustrationKey: 'planets-extreme'
        },
        {
          heading: 'Ocean Moons and Potential for Life',
          body: 'Jupiter’s moon Europa and Saturn’s moon Enceladus hide vast liquid water oceans under thick icy crusts. Cryovolcanoes on Enceladus shoot plumes of water vapor into space, making them prime targets in the search for extraterrestrial microbial life.',
          facts: [
            'Europa may have twice as much liquid water as all of Earth’s oceans combined.',
            'Titan, Saturn’s largest moon, has a dense nitrogen atmosphere and lakes of liquid methane.'
          ],
          illustrationKey: 'ocean-moons'
        }
      ]
    },
    {
      order: 4,
      title: 'Gravity and Orbital Mechanics',
      category: 'Space Science',
      description: 'Understand how objects stay in orbit: Isaac Newton’s cannonball thought experiment and Kepler’s laws of motion.',
      readTimeMinutes: 6,
      xpReward: 80,
      content: [
        {
          heading: 'How Orbiting Actually Works',
          body: 'To orbit Earth, a spacecraft does not just fly high; it must travel sideways extremely fast! At Low Earth Orbit (LEO), an orbital speed of ~28,000 km/h (17,500 mph) is required so that as gravity pulls the spacecraft down, the curved surface of Earth curves away at the exact same rate. Orbiting is continuous freefall!',
          facts: [
            'Astronauts on the ISS feel weightless not because there is no gravity, but because they and the station are in perpetual freefall.',
            'Gravity at ISS altitude (400 km) is still roughly 90% as strong as on the surface of Earth.'
          ],
          illustrationKey: 'orbital-freefall'
        },
        {
          heading: 'Kepler’s Three Laws',
          body: 'Johannes Kepler showed that planetary orbits are ellipses (not circles) with the Sun at one focus. A planet sweeps out equal areas in equal times, speeding up when closest to the Sun (perihelion) and slowing down when farthest (aphelion).',
          facts: [
            'Escaping Earth’s gravity completely requires escape velocity: about 11.2 km/s (40,320 km/h).'
          ],
          illustrationKey: 'kepler-ellipse'
        }
      ]
    },
    {
      order: 5,
      title: 'Spacecraft and Rockets',
      category: 'Spacecraft & Tech',
      description: 'The science of rocket propulsion: Newton’s Third Law, cryogenic liquid fuels, staging, and thermal heat shields.',
      readTimeMinutes: 6,
      xpReward: 70,
      content: [
        {
          heading: 'The Rocket Principle',
          body: 'Rockets operate according to Newton’s Third Law: "For every action, there is an equal and opposite reaction." By burning propellant and expelling high-velocity hot gas downward through a convergent-divergent rocket nozzle, the rocket is propelled upward.',
          facts: [
            'The Tsiolkovsky Rocket Equation governs the relationship between exhaust velocity, vehicle mass, and total change in speed (Delta-v).',
            'Over 85% of a rocket’s total liftoff weight is typically fuel and oxidizer.'
          ],
          illustrationKey: 'rocket-stages'
        },
        {
          heading: 'Multi-Stage Architecture',
          body: 'To carry useful payloads to orbit, rockets use multiple stages. Once a stage has burned its propellant, it is jettisoned to eliminate dead weight, allowing the remaining stages to accelerate much more efficiently.',
          facts: [
            'Modern rockets like Falcon 9 and Starship have introduced reusable first stages that perform propulsive vertical landings.'
          ],
          illustrationKey: 'staging'
        }
      ]
    },
    {
      order: 6,
      title: 'International Space Station (ISS)',
      category: 'Spacecraft & Tech',
      description: 'Inside humanity’s microgravity laboratory: orbital operations, solar power arrays, and international teamwork.',
      readTimeMinutes: 7,
      xpReward: 80,
      content: [
        {
          heading: 'A Football-Field-Sized Space Lab',
          body: 'The ISS travels around Earth once every 90 minutes at an altitude of approximately 420 km. Astronauts on board witness 16 sunrises and sunsets every single day! It has been continuously inhabited by humans since November 2000.',
          facts: [
            'The ISS solar arrays span over 73 meters, generating more than 120 kilowatts of usable electrical power.',
            'Five space agencies collaborate on the ISS: NASA (USA), Roscosmos (Russia), ESA (Europe), JAXA (Japan), and CSA (Canada).'
          ],
          illustrationKey: 'iss-overview'
        },
        {
          heading: 'Pioneering Microgravity Science',
          body: 'Experiments on the ISS study how microgravity affects protein crystals, human bone density, plant growth, and fluid dynamics, developing new pharmaceuticals and technologies for future deep space exploration.',
          facts: [
            'Astronauts must exercise for two hours every day using specialized resistive exercise devices (ARED) to prevent bone mineral loss.'
          ],
          illustrationKey: 'iss-science'
        }
      ]
    },
    {
      order: 7,
      title: 'Astronaut Life & Living in Space',
      category: 'Astronautics',
      description: 'Day-to-day existence in microgravity: freeze-dried nutrition, sleeping upright on the wall, hygiene, and spacewalks.',
      readTimeMinutes: 6,
      xpReward: 65,
      content: [
        {
          heading: 'Eating, Sleeping, and Floating',
          body: 'In space, crumbs and loose droplets of liquid could float into equipment or astronauts’ eyes, causing hazards. Food is specially packaged in vacuum pouches, tortillas are used instead of crumbly bread, and astronauts sleep inside tethered sleeping bags hooked to cabin walls.',
          facts: [
            'Astronauts grow between 2 to 5 centimeters (1 to 2 inches) taller in space as their spinal column expands without gravity compressing it.',
            'Spicy sauces and hot peppers are popular because fluid shifts to the head reduce taste sensitivity!'
          ],
          illustrationKey: 'astronaut-food'
        },
        {
          heading: 'Spacewalks (EVA)',
          body: 'An Extravehicular Activity (EVA) can last up to 8 hours. The spacesuit is an individual miniature spacecraft providing oxygen, temperature regulation, carbon dioxide scrubbing, and protection from micrometeorites.',
          facts: [
            'Astronauts pre-breathe pure oxygen for hours before spacewalks to remove nitrogen from their blood and avoid the bends.'
          ],
          illustrationKey: 'spacewalk'
        }
      ]
    },
    {
      order: 8,
      title: 'Space Exploration & Deep Space',
      category: 'Astronomy',
      description: 'From Apollo and Artemis to robotic explorers: Curiosity, Perseverance, James Webb Space Telescope, and Voyager.',
      readTimeMinutes: 7,
      xpReward: 75,
      content: [
        {
          heading: 'Robotic Trailblazers',
          body: 'Before humans venture to deep space, robotic orbiters and rovers survey the landscape. NASA’s Perseverance rover is currently caching rock cores in Jezero Crater on Mars for future retrieval, while the James Webb Space Telescope peers back 13.5 billion years into cosmic dawn.',
          facts: [
            'Voyager 1, launched in 1977, is the farthest human-made object from Earth, currently in interstellar space over 24 billion km away.',
            'Perseverance carried Ingenuity, the first robotic helicopter to achieve powered flight on another planet.'
          ],
          illustrationKey: 'mars-rover'
        },
        {
          heading: 'The Artemis Era',
          body: 'NASA’s Artemis program aims to land the first woman and the first person of color on the Moon, building the Lunar Gateway station and establishing sustainable infrastructure for future crewed expeditions to Mars.',
          facts: [
            'The Moon’s South Pole contains water ice sequestered inside permanently shadowed craters, a valuable resource for rocket fuel.'
          ],
          illustrationKey: 'artemis'
        }
      ]
    },
    {
      order: 9,
      title: 'Space Safety & Emergency Protocols',
      category: 'Astronautics',
      description: 'Crucial life-support systems, fire suppression in microgravity, rapid depressurization response, and orbital debris avoidance.',
      readTimeMinutes: 6,
      xpReward: 70,
      content: [
        {
          heading: 'The Big Three Emergencies',
          body: 'Astronauts drill relentlessly for three principal onboard emergencies: Rapid Depressurization (puncture/leak), Toxic Atmosphere (ammonia coolant leak), and Fire. Every module is equipped with quick-don oxygen masks and isolation hatch procedures.',
          facts: [
            'In zero-g, flames burn spherical and blue rather than teardrop-shaped because warm air does not rise without gravity convection.',
            'Space stations utilize automatic ultrasonic sensors to detect high-frequency hiss from micro-leaks in the pressure hull.'
          ],
          illustrationKey: 'emergency-safety'
        },
        {
          heading: 'Space Debris and Whipple Shields',
          body: 'Over 30,000 trackable pieces of space junk orbit Earth at 8 km/s. Spacecraft use layered aluminum and Nextel Kevlar Whipple shields that vaporize small debris upon impact before it can penetrate the crew cabin.',
          facts: [
            'The ISS occasionally performs Debris Avoidance Maneuvers (DAM) by firing service module thrusters to steer clear of known debris paths.'
          ],
          illustrationKey: 'whipple-shield'
        }
      ]
    },
    {
      order: 10,
      title: 'Basic Space Science & Astrophysics',
      category: 'Space Science',
      description: 'Unraveling the cosmos: electromagnetic spectrum, stellar lifecycles, black holes, and the expansion of the universe.',
      readTimeMinutes: 8,
      xpReward: 90,
      content: [
        {
          heading: 'Looking Beyond Visible Light',
          body: 'Human eyes only detect a tiny slice of the electromagnetic spectrum. Space telescopes use infrared (JWST), X-rays (Chandra), and radio waves to observe obscured star-forming nebulas, supermassive black holes, and ancient cosmic microwave background radiation.',
          facts: [
            'Infrared light can penetrate thick interstellar dust clouds that block visible light.',
            'A light-year is a measure of distance, not time: roughly 9.46 trillion kilometers (5.88 trillion miles).'
          ],
          illustrationKey: 'em-spectrum'
        },
        {
          heading: 'The Life and Death of Stars',
          body: 'Stars are born in nebulae, burn hydrogen for millions or billions of years, and end their lives depending on mass. Sun-sized stars shed outer layers into glowing planetary nebulae, leaving white dwarfs. Massive stars explode as supernovae, collapsing into neutron stars or black holes.',
          facts: [
            'All heavy elements in your body (carbon, nitrogen, oxygen, iron) were forged inside ancient stars and scattered across space by supernovae!'
          ],
          illustrationKey: 'supernova'
        }
      ]
    }
  ]);

  // 3. Create Primary Astronaut Training Missions (Section 5.4 + Section 6.4)
  const missions = await Mission.create([
    {
      missionCode: 'MISSION-A',
      title: 'Space Orientation & Planetary Survey',
      category: 'Space Orientation',
      difficulty: 'Beginner',
      xpReward: 150,
      badgeCode: 'FIRST_MISSION',
      description: 'Calibrate your astronaut sensors, analyze astronomical telemetry, and accurately identify celestial bodies by their atmospheric, thermal, and gravitational signatures.',
      objectives: [
        'Analyze 4 planetary telemetry profiles (atmosphere, surface temp, gravity).',
        'Correctly identify the target celestial bodies.',
        'Score at least 75% on the cosmic orientation check.'
      ],
      instructions: [
        'Review the sensor readouts for each mystery celestial body.',
        'Examine atmospheric composition (CO2, Nitrogen, Hydrogen/Helium), gravity, and average surface temperatures.',
        'Select the corresponding planet and submit your telemetry diagnosis.'
      ],
      activityType: 'planet_id',
      activityData: {
        targets: [
          {
            id: 'target-1',
            telemetry: {
              atmosphere: '96.5% Carbon Dioxide, 3.5% Nitrogen with Sulfuric Acid Clouds',
              temperature: '465°C (Runaway Greenhouse Effect)',
              gravity: '8.87 m/s² (0.904 g)',
              feature: 'Retrograde rotation; surface pressure 92 times Earth’s'
            },
            options: ['Mercury', 'Venus', 'Mars', 'Titan'],
            correctAnswer: 'Venus',
            explanation: 'Venus is the hottest planet in the Solar System due to an extreme runaway CO2 greenhouse effect, shrouded in sulfuric clouds.'
          },
          {
            id: 'target-2',
            telemetry: {
              atmosphere: '95% CO2, 2.6% Molecular Nitrogen, 1.9% Argon',
              temperature: '-60°C average (Polar caps of dry ice and water)',
              gravity: '3.72 m/s² (0.38 g)',
              feature: 'Iron oxide rich soil, dust storms, Olympus Mons volcano'
            },
            options: ['Mars', 'Mercury', 'Europa', 'Io'],
            correctAnswer: 'Mars',
            explanation: 'Mars exhibits thin CO2 atmosphere, reddish regolith rich in iron oxide, and reduced 0.38g gravity.'
          },
          {
            id: 'target-3',
            telemetry: {
              atmosphere: 'Trace amounts of Sodium, Potassium, Helium, Hydrogen (exosphere)',
              temperature: 'Day: +430°C / Night: -180°C',
              gravity: '3.7 m/s² (0.38 g)',
              feature: 'Heavily cratered surface, closest planet to the Sun'
            },
            options: ['Pluto', 'Mercury', 'Callisto', 'Moon'],
            correctAnswer: 'Mercury',
            explanation: 'Mercury has virtually no atmosphere to retain heat, leading to dramatic 600°C day-to-night temperature swings.'
          },
          {
            id: 'target-4',
            telemetry: {
              atmosphere: '90% Hydrogen, 10% Helium with trace methane & ammonia crystals',
              temperature: '-110°C cloud tops',
              gravity: '24.79 m/s² (2.53 g)',
              feature: 'Great Red Spot anticyclonic storm, strong planetary magnetic field'
            },
            options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'],
            correctAnswer: 'Jupiter',
            explanation: 'Jupiter is the massive king of planets, featuring the Great Red Spot storm and intense 2.53g gravity.'
          }
        ]
      }
    },
    {
      missionCode: 'MISSION-B',
      title: 'Zero Gravity & Microgravity Dynamics',
      category: 'Zero Gravity Training',
      difficulty: 'Intermediate',
      xpReward: 175,
      badgeCode: 'GRAVITY_EXPERT',
      description: 'Master microgravity physics! Differentiate between mass and weight, manage momentum, and execute reaction thruster pulses to stabilize a drifting space module.',
      objectives: [
        'Demonstrate understanding of mass vs weight in freefall.',
        'Calculate thruster pulse delta-v to counter inertia.',
        'Stabilize simulated rotational drift to zero angular velocity.'
      ],
      instructions: [
        'Analyze the physics scenario for mass, weight, and inertia in orbit.',
        'Apply Newton’s Third Law to cancel out momentum.',
        'Select the appropriate stabilization sequence to dock safely.'
      ],
      activityType: 'zero_gravity',
      activityData: {
        challenges: [
          {
            id: 'zg-1',
            question: 'An astronaut has a mass of 70 kg on Earth. What is their mass and weight when floating inside the International Space Station in orbit?',
            options: [
              'Mass is 70 kg; weight is zero (weightless state in freefall).',
              'Mass is 0 kg; weight is 70 kg.',
              'Both mass and weight become 0.',
              'Mass decreases to 7 kg; weight remains unchanged.'
            ],
            correctAnswer: 0,
            explanation: 'Mass is the amount of matter in an object and remains 70 kg anywhere in the universe! Weight is the gravitational force felt against a surface, which is zero in freefall.'
          },
          {
            id: 'zg-2',
            question: 'While conducting a spacewalk outside the ISS, your tether releases and you begin drifting away at 0.5 m/s. You are holding a 10 kg toolbox. According to Newton’s Third Law, how can you stop your drift?',
            options: [
              'Wave your arms rapidly to generate air resistance.',
              'Throw the 10 kg toolbox directly away from the space station with high force.',
              'Hold the toolbox tightly against your chest.',
              'Wait for gravity to pull you back to the station in 5 seconds.'
            ],
            correctAnswer: 1,
            explanation: 'By throwing the toolbox away from the station (away action), the equal and opposite reaction pushes you back toward the station (opposite reaction)!'
          },
          {
            id: 'zg-3',
            question: 'A 500 kg cargo pod is drifting at +2.0 m/s toward the docking port. Your cold-gas thruster exerts 250 Newtons of braking thrust. For how many seconds must the thruster fire to bring the pod to a complete stop? (F = m × a; v = a × t)',
            options: [
              '2.0 seconds',
              '4.0 seconds',
              '10.0 seconds',
              '0.5 seconds'
            ],
            correctAnswer: 1,
            explanation: 'Acceleration a = F / m = 250 N / 500 kg = 0.5 m/s². Time t = v / a = 2.0 m/s / 0.5 m/s² = 4.0 seconds!'
          }
        ]
      }
    },
    {
      missionCode: 'MISSION-C',
      title: 'Orbital Navigation & ISS Rendezvous',
      category: 'Space Navigation',
      difficulty: 'Intermediate',
      xpReward: 200,
      badgeCode: 'MISSION_MASTER',
      description: 'Plot orbital transfer trajectories, calculate Hohmann transfer burn windows, and guide an automated resupply capsule into the docking cone of the Harmony module.',
      objectives: [
        'Calculate required prograde/retrograde burn vectors.',
        'Align approach velocity within the 0.1 m/s docking safety corridor.',
        'Complete successful automated soft-capture.'
      ],
      instructions: [
        'Analyze orbital parameters: current altitude, target orbital velocity, and phase angle.',
        'Select the correct thruster burn vector to raise or lower orbital altitude.',
        'Execute final range-rate braking burns to achieve zero relative speed.'
      ],
      activityType: 'navigation',
      activityData: {
        steps: [
          {
            id: 'nav-1',
            title: 'Orbital Phasing Burn',
            scenario: 'Your capsule is orbiting Earth at 350 km altitude. The ISS is orbiting ahead of you at 420 km altitude. To catch up with the space station in a lower orbit where orbital period is faster, what burn should you perform?',
            options: [
              'Perform a retrograde burn to lower your orbit even further and orbit faster.',
              'Burn prograde immediately to match ISS altitude before catching up.',
              'Turn on radial thrusters toward the center of the Earth.',
              'Fire retro thrusters until orbital velocity is zero.'
            ],
            correctAnswer: 0,
            explanation: 'In orbital mechanics, lower orbits have higher orbital velocity and shorter orbital periods! Staying lower allows you to catch up with the target.'
          },
          {
            id: 'nav-2',
            title: 'Hohmann Transfer Injection',
            scenario: 'You are now directly phased 50 km behind the ISS. To raise the apogee of your orbit from 350 km to 420 km to intercept the station, which direction must your main engines fire?',
            options: [
              'Prograde (forward along the velocity vector)',
              'Retrograde (backward against the velocity vector)',
              'Normal (perpendicular north to the orbital plane)',
              'Radial-in (toward Earth’s core)'
            ],
            correctAnswer: 0,
            explanation: 'A prograde burn adds kinetic energy, raising the opposite side of the orbit (apogee) to intercept the higher altitude!'
          },
          {
            id: 'nav-3',
            title: 'Final Docking Corridor Entry',
            scenario: 'Range: 15 meters. Range-rate: -0.35 m/s closing speed. ISS safety protocol stipulates that contact velocity must not exceed -0.10 m/s. What correction command must you send?',
            options: [
              'Fire forward RCS braking thrusters to apply +0.25 m/s delta-v.',
              'Fire aft thrusters to accelerate into the docking latch.',
              'Emergency abort roll 180 degrees.',
              'Disable all attitude control systems.'
            ],
            correctAnswer: 0,
            explanation: 'Firing braking RCS thrusters reduces closing speed from -0.35 m/s to a gentle, safe -0.10 m/s for latch engagement!'
          }
        ]
      }
    },
    {
      missionCode: 'MISSION-D',
      title: 'Emergency Life Support & Rapid Response',
      category: 'Emergency Response',
      difficulty: 'Advanced',
      xpReward: 220,
      badgeCode: 'MISSION_MASTER',
      description: 'Face high-stress critical emergencies in real-time simulation. Handle cabin micro-punctures, thermal coolant loops, and solar radiation storms with scientifically sound emergency protocols.',
      objectives: [
        'Identify primary danger signs in life-support telemetry.',
        'Prioritize crew survival actions under time-critical conditions.',
        'Isolate compromised modules and restore environmental stability.'
      ],
      instructions: [
        'Read emergency warning alarms and sensor readings carefully.',
        'Choose the immediate, textbook NASA/ESA protocol response.',
        'Evaluate post-incident telemetry to ensure crew safety.'
      ],
      activityType: 'emergency_response',
      activityData: {
        scenarios: [
          {
            id: 'em-1',
            title: 'Hull Depressurization Alarm',
            readout: 'WARNING: Cabin pressure dropping at 3.5 hPa/min in Service Module. Oxygen partial pressure is 18.2 kPa and decreasing.',
            question: 'What is the immediate highest priority action for the flight crew?',
            options: [
              'Don Emergency Mask/O2 hoods, check pressure rate-of-decay, and begin isolating module hatches.',
              'Spend 15 minutes searching for the tiny leak with soapy water.',
              'Immediately vent all oxygen into space.',
              'Power down all computers to save battery.'
            ],
            correctAnswer: 0,
            explanation: 'Standard emergency procedure: Don breathing masks immediately, verify leak severity, and isolate hatches to prevent losing the entire station’s atmosphere.'
          },
          {
            id: 'em-2',
            title: 'Coronal Mass Ejection (Solar Flare) Alert',
            readout: 'SPACE WEATHER ALERT: Solar flare class X8.2 detected facing Earth. High-energy proton storm arrival in 45 minutes.',
            question: 'Where should crew members shelter to minimize ionizing radiation absorption?',
            options: [
              'In the most heavily shielded central module (e.g., Destiny or Zvezda aft surrounded by water storage bags).',
              'Inside the glass-domed Cupola observation module for visual tracking.',
              'Perform a spacewalk to shield the exterior with foil.',
              'Open all airlock valves.'
            ],
            correctAnswer: 0,
            explanation: 'Water is rich in hydrogen atoms, making it an outstanding shield against high-energy cosmic rays and protons. Sheltering among water tanks minimizes crew radiation dose.'
          },
          {
            id: 'em-3',
            title: 'Toxic Ammonia Coolant Influx',
            readout: 'ALARM: Trace contaminant detector registers ammonia vapors in US Lab atmosphere. Loop B thermal pump cavitation.',
            question: 'What is the correct crew containment procedure?',
            options: [
              'Don oxygen respirators, seal the lab hatch, isolate ventilation ducting, and activate carbon/acid scrubbers.',
              'Inhale deeply to test the odor.',
              'Turn on cabin fans to distribute the vapor throughout all modules.',
              'Turn off cooling pumps completely and do nothing.'
            ],
            correctAnswer: 0,
            explanation: 'Ammonia is a toxic coolant. Immediate respirator donning, hatch sealing, and ventilation interlock prevent poisoning other compartments.'
          }
        ]
      }
    },
    {
      missionCode: 'MISSION-E',
      title: 'Mars Surface Exploration & Science Lab',
      category: 'Space Exploration',
      difficulty: 'Advanced',
      xpReward: 250,
      badgeCode: 'STELLAR_COMMANDER',
      description: 'Command a robotic rover on the surface of Mars. Analyze geologic strata in Jezero Crater, deploy scientific instruments (APXS, Raman spectrometer), and seal pristine biosignature samples.',
      objectives: [
        'Deploy drill and spectrometers to analyze target rock formations.',
        'Distinguish between igneous basalts and ancient sedimentary clay deposits.',
        'Identify high-priority samples with potential ancient microbial preservation.'
      ],
      instructions: [
        'Review the Martian site imagery and spectrometry telemetry.',
        'Select the appropriate science tool for geological investigation.',
        'Seal the sample tube for future Earth return mission.'
      ],
      activityType: 'space_exploration',
      activityData: {
        steps: [
          {
            id: 'exp-1',
            title: 'Sample Target Evaluation',
            site: 'Jezero Delta - Ancient Lakebed Sediments',
            spectrometry: 'Elevated Silicon, Carbonates, and fine-grained smectite clay minerals.',
            question: 'Why are fine-grained smectite clay minerals considered prime targets in the search for ancient Martian biosignatures?',
            options: [
              'Clays form in persistent neutral liquid water and excel at preserving organic molecules over billions of years.',
              'Clays are hot volcanic magma that sterilizes rocks.',
              'Clays prove that Mars had molten iron oceans yesterday.',
              'Clays indicate the presence of alien cities.'
            ],
            correctAnswer: 0,
            explanation: 'Clay minerals form in liquid water environments and possess layered crystalline structures that trap and preserve ancient organic compounds.'
          },
          {
            id: 'exp-2',
            title: 'Instrument Deployment',
            scenario: 'You need to detect organic chemical bonds without destroying the rock sample. Which scientific instrument should you deploy from the rover turret?',
            options: [
              'Raman and Luminescence Spectrometer (UV laser)',
              'Heavy high-explosive percussion charge',
              'Household magnifying glass',
              'High-pressure steam hose'
            ],
            correctAnswer: 0,
            explanation: 'UV Raman spectroscopy (like NASA’s SHERLOC instrument on Perseverance) uses ultraviolet lasers to induce fluorescence from organic molecules non-destructively.'
          },
          {
            id: 'exp-3',
            title: 'Sample Hermetic Sealing',
            scenario: 'Core sample #14 is successfully drilled into a titanium tube. To ensure no terrestrial microbes contaminate the sample before analysis on Earth, what standard must be met?',
            options: [
              'Ultraclean hermetic seal with gold-coated airtight plug under ultra-high vacuum standards.',
              'Wrap the rock in plastic food wrap.',
              'Leave the tube open to Martian dust storms.',
              'Wash the sample with lake water.'
            ],
            correctAnswer: 0,
            explanation: 'Planetary protection protocols demand hermetically sealed titanium tubes to prevent terrestrial contamination and preserve Martian volatiles.'
          }
        ]
      }
    }
  ]);

  // 4. Create Interactive Knowledge Quizzes (Section 5.6)
  const quizzes = await Quiz.create([
    {
      title: 'Cadet Astronaut Wings: Space Fundamentals',
      description: 'Test your grasp of space basics, the Kármán line, and atmospheric layers to earn your Junior Astronaut badge!',
      passingScore: 75,
      xpReward: 100,
      questions: [
        {
          id: 'q1',
          prompt: 'At what altitude does the Kármán line demarcate the edge of space?',
          options: ['10 km', '50 km', '100 km', '500 km'],
          correctIndex: 2,
          explanation: 'The Kármán line is defined at 100 kilometers (62 miles) above Earth’s sea level.',
          factTag: 'Kármán Line'
        },
        {
          id: 'q2',
          prompt: 'Why can sound not travel through outer space?',
          options: [
            'Space is too cold for sound waves.',
            'There is no atmosphere or molecular medium for sound waves to vibrate.',
            'Light moves faster than sound and cancels it out.',
            'Gravity pulls sound waves back to Earth.'
          ],
          correctIndex: 1,
          explanation: 'Sound is a mechanical pressure wave that requires a physical medium (gas, liquid, or solid) to propagate.',
          factTag: 'Vacuum Physics'
        },
        {
          id: 'q3',
          prompt: 'What keeps the International Space Station in orbit around Earth without falling?',
          options: [
            'Antigravity engines that push away from the core.',
            'High forward speed (~28,000 km/h) creating a continuous state of freefall around Earth’s curvature.',
            'The ISS is outside Earth’s gravitational field entirely.',
            'Giant helium balloons attached to the solar panels.'
          ],
          correctIndex: 1,
          explanation: 'Orbiting is continuous freefall: the ISS falls toward Earth, but moves forward fast enough that Earth curves away at the same rate!',
          factTag: 'Orbital Mechanics'
        },
        {
          id: 'q4',
          prompt: 'Which planet is the hottest in our Solar System despite not being the closest to the Sun?',
          options: ['Mercury', 'Venus', 'Mars', 'Jupiter'],
          correctIndex: 1,
          explanation: 'Venus is the hottest planet (465°C) due to its thick carbon dioxide atmosphere causing a runaway greenhouse effect.',
          factTag: 'Planetary Science'
        }
      ]
    },
    {
      title: 'Advanced Astronautics & Orbital Dynamics',
      description: 'Demonstrate deep knowledge of rocket propulsion, Keplerian mechanics, and space station operations.',
      passingScore: 80,
      xpReward: 120,
      questions: [
        {
          id: 'q5',
          prompt: 'Which scientific law explains why expelled rocket exhaust pushes the rocket forward?',
          options: [
            'Newton’s First Law (Inertia)',
            'Newton’s Second Law (F = ma)',
            'Newton’s Third Law (Action and Reaction)',
            'Kepler’s Third Law'
          ],
          correctIndex: 2,
          explanation: 'Newton’s Third Law states that for every action, there is an equal and opposite reaction.',
          factTag: 'Propulsion'
        },
        {
          id: 'q6',
          prompt: 'How often do astronauts on the International Space Station witness a sunrise or sunset?',
          options: [
            'Once every 24 hours',
            'Once every 90 minutes (~16 times per day)',
            'Once every 7 days',
            'Space has continuous daylight with zero sunsets'
          ],
          correctIndex: 1,
          explanation: 'Traveling at 28,000 km/h, the ISS completes one Earth orbit roughly every 90 minutes, yielding 16 sunrises and sunsets per day!',
          factTag: 'ISS Operations'
        },
        {
          id: 'q7',
          prompt: 'Why must astronauts exercise approximately 2 hours every day while aboard the ISS?',
          options: [
            'To stay awake during boring shifts',
            'To counteract severe muscle atrophy and bone mineral density loss caused by lack of gravity',
            'To generate electricity for the station treadmill',
            'Because spacesuits only fit very muscular astronauts'
          ],
          correctIndex: 1,
          explanation: 'Without gravitational resistance, human bones lose up to 1-1.5% mineral density per month unless stimulated by intense resistive exercise.',
          factTag: 'Human Physiology'
        },
        {
          id: 'q8',
          prompt: 'What is the primary reason bread is replaced by flour tortillas on the space station?',
          options: [
            'Bread crumbs float in microgravity, potentially getting into astronauts’ eyes or clogging electronic air filters.',
            'Tortillas are cheaper to purchase on Earth.',
            'Bread spoils in less than 2 hours in zero gravity.',
            'NASA astronauts are required to eat tacos every day.'
          ],
          correctIndex: 0,
          explanation: 'Crumb-free tortillas prevent floating debris that could damage electronics or cause airway hazards.',
          factTag: 'Space Nutrition'
        },
        {
          id: 'q9',
          prompt: 'What is the velocity required to completely escape Earth’s gravitational well from the surface?',
          options: ['7.9 km/s', '11.2 km/s', '25.0 km/s', '300,000 km/s'],
          correctIndex: 1,
          explanation: 'Earth’s escape velocity is approximately 11.2 km/s (roughly 40,320 km/h or 25,000 mph).',
          factTag: 'Astrodynamics'
        }
      ]
    }
  ]);

  // 5. Create Default Admin & Cadet Accounts
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin@12345', salt);
  const cadetPasswordHash = await bcrypt.hash('Cadet@12345', salt);

  const adminUser = await User.create({
    name: 'Flight Director Nova',
    email: 'admin@nova.space',
    passwordHash: adminPasswordHash,
    role: 'admin',
    callsign: 'Flight Director',
    avatar: 'helmet-gold',
    totalXP: 2500,
    rank: 'Commander',
    bio: 'Lead Mission Coordinator for the NOVA 2.O Astronaut Training Academy.',
  });

  const cadetUser = await User.create({
    name: 'Alex Starling',
    email: 'cadet@nova.space',
    passwordHash: cadetPasswordHash,
    role: 'cadet',
    callsign: 'Star Voyager',
    avatar: 'helmet-cyan',
    totalXP: 380,
    rank: 'Junior Astronaut',
    bio: 'Passionate young space explorer training for Mars mission!',
  });

  // Seed initial completed progress for cadet to showcase dashboard
  await UserProgress.create([
    {
      userId: cadetUser._id,
      moduleId: modules[0]._id,
      type: 'module',
      status: 'completed',
      progressPercent: 100,
      xpEarned: 60,
      completedAt: new Date(),
    },
    {
      userId: cadetUser._id,
      moduleId: modules[1]._id,
      type: 'module',
      status: 'completed',
      progressPercent: 100,
      xpEarned: 60,
      completedAt: new Date(),
    },
    {
      userId: cadetUser._id,
      missionId: missions[0]._id,
      type: 'mission',
      status: 'completed',
      progressPercent: 100,
      xpEarned: 150,
      completedAt: new Date(),
    },
  ]);

  // Give cadet first achievement
  await UserAchievement.create({
    userId: cadetUser._id,
    achievementId: achievements[0]._id,
    unlockedAt: new Date(),
  });

  // Give cadet a quiz attempt
  await QuizAttempt.create({
    userId: cadetUser._id,
    quizId: quizzes[0]._id,
    answers: [2, 1, 1, 1],
    score: 4,
    totalQuestions: 4,
    percentage: 100,
    passed: true,
    xpEarned: 100,
    completedAt: new Date(),
  });

  console.log('[NOVA 2.O Database] Seed completed successfully!');
  console.log('   Admin credentials: admin@nova.space / Admin@12345');
  console.log('   Cadet credentials: cadet@nova.space / Cadet@12345');
};
