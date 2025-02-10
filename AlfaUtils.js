// Name: Alfakma Utils
// Author: alfakma17
// Description: many block utils
// ID: alfakmautils
// License: MIT

(function(Scratch) {
	'use strict';
	
	if (!Scratch.extensions.unsandboxed) {
    throw new Error('Alfakma Utils must be unsandboxed to run!');
  }

  let prev_extensions = Array.from(vm.extensionManager._loadedExtensions.keys());
  if (prev_extensions.includes('alfakmautils')) {
    return; // extension already loaded
  }
  
  //Globals
  const bases = ['2','10','16','36'];
  const chars_base = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const cast = Scratch.Cast;
  const runtime = vm.runtime;
  const validKeyboardInputs = [
    // Special Inputs
    { text: "space", value: "space" },
    { text: "up arrow", value: "up arrow" },
    { text: "down arrow", value: "down arrow" },
    { text: "right arrow", value: "right arrow" },
    { text: "left arrow", value: "left arrow" },
    { text: "enter", value: "enter" },
    // TW: Extra Special Inputs
    { text: "backspace", value: "backspace" },
    { text: "delete", value: "delete" },
    { text: "shift", value: "shift" },
    { text: "caps lock", value: "caps lock" },
    { text: "scroll lock", value: "scroll lock" },
    { text: "control", value: "control" },
    { text: "escape", value: "escape" },
    { text: "insert", value: "insert" },
    { text: "home", value: "home" },
    { text: "end", value: "end" },
    { text: "page up", value: "page up" },
    { text: "page down", value: "page down" },
    // Letter Keyboard Inputs
    { text: "a", value: "a" },
    { text: "b", value: "b" },
    { text: "c", value: "c" },
    { text: "d", value: "d" },
    { text: "e", value: "e" },
    { text: "f", value: "f" },
    { text: "g", value: "g" },
    { text: "h", value: "h" },
    { text: "i", value: "i" },
    { text: "j", value: "j" },
    { text: "k", value: "k" },
    { text: "l", value: "l" },
    { text: "m", value: "m" },
    { text: "n", value: "n" },
    { text: "o", value: "o" },
    { text: "p", value: "p" },
    { text: "q", value: "q" },
    { text: "r", value: "r" },
    { text: "s", value: "s" },
    { text: "t", value: "t" },
    { text: "u", value: "u" },
    { text: "v", value: "v" },
    { text: "w", value: "w" },
    { text: "x", value: "x" },
    { text: "y", value: "y" },
    { text: "z", value: "z" },
    // Number Keyboard Inputs
    { text: "0", value: "0" },
    { text: "1", value: "1" },
    { text: "2", value: "2" },
    { text: "3", value: "3" },
    { text: "4", value: "4" },
    { text: "5", value: "5" },
    { text: "6", value: "6" },
    { text: "7", value: "7" },
    { text: "8", value: "8" },
    { text: "9", value: "9" },
  ];
  function var_id_from_name(variable_name,util) { // copied from SharkPool
    //support for all variable types (Cloud, Sprite-Only, Global)
    variable_name = Scratch.Cast.toString(variable_name);
    const cloudID = runtime.getTargetForStage().lookupVariableByNameAndType(Scratch.Cast.toString("ÃƒÂ¢Ã‹ÂœÃ‚Â " + variable_name), "");
    if (cloudID) return cloudID.id;
    let varFind = "";
    for (const name of Object.getOwnPropertyNames(util.target.variables)) {
      varFind = util.target.variables[name].name;
      if (varFind === variable_name) return util.target.variables[name].id;
    }
    const ID = runtime.getTargetForStage().lookupVariableByNameAndType(variable_name, "");
    if (!ID) return "";
    return ID.id;
  }
  function var_name_exists(variable_name,util) {
    return Scratch.Cast.toBoolean(var_id_from_name(variable_name,util));
  }
  function get_var(variable_name,util) {
    if (!var_name_exists(variable_name,util)) { return 'undefined'; }
    let variable = util.target.lookupOrCreateVariable(variable_name,variable_name);
   	return variable.value;
  }
  function set_var(variable_name,value,util) {
    if (!var_name_exists(variable_name,util)) { return; }
    let variable = util.target.lookupOrCreateVariable(variable_name,variable_name);
   	variable.value = value;
    if (variable.isCloud) { // added from TurboWarp's Scratch 3 code
      util.ioQuery('cloud', 'requestUpdateVariable', [variable.name, value]);
    }
  }
  // get list for variables menus; from SharkPool's extension (see top for credits)
  function get_variables_for_menu() {
    const globalVars = Object.values(vm.runtime.getTargetForStage().variables).filter((x) => x.type == "");
    const localVars = Object.values(vm.editingTarget.variables).filter((x) => x.type == "");
    const uniqueVars = [...new Set([...globalVars, ...localVars])];
    if (uniqueVars.length === 0) return ["(choose a variable)"];
    return uniqueVars.map((i) => (Scratch.Cast.toString(i.name)));
  }
  function mod(a,b) {
    return ((a % b) + b) % b;
  }
  function getRandInt(min, max) {
    return Math.floor(Math.random() * ((max + 1) - min) + min);
  }
  function fact(n) {
    let res = 1; 
    if(n === 0)
        return 1;
    for (let i = 2; i <= n; i++) 
        res = res * i; 
    return res; 
	}
  function get_illion(n) {
    n = Math.round(n); // ensure integer

    // skip all logic and say 'thousand' if n is 0
    if (n <= 0) {
      return 'thousand';
    }

    // convert n into a base-1000 number with its digits in 'sections' from most significant to least significant (in other words splitting 1234567 into 1,234,567 where you would write commas)
    let sections = [];
    let place_value = 1;
    while (n >= place_value) {
      sections.unshift(mod(Math.floor(n / place_value), 1000));
      place_value *= 1000;
    }

    // call 'get_illion_short' for each base-1000 'digit' and combine them into one string
    let str = '';
    for (let i = 0; i < sections.length; i++) {
      str += get_illion_short(sections[i]);
    }

    // add the final '-on' to finish 'illion'
    str += 'on';

    return str;
  }
  function get_illion_short(n) {
    // See this for more info about the algorithm: https://en.wikipedia.org/wiki/Names_of_large_numbers#Extensions_of_the_standard_dictionary_numbers

    // return one of the basic 10 illions if n < 10
    if (n < 10) {
      let small_illions = ['nilli','milli','billi','trilli','quadrilli','quintilli','sextilli','septilli','octilli','nonilli'];
      return small_illions[n];
    }

    // get each component of the illion
    let possible_ones = ['','un','duo','tre','quattuor','quin','se','septe','octo','nove'];
    let possible_tens = ['','deci','viginti','triginta','quadraginta','quinquaginta','sexaginta','septuaginta','octoginta','nonaginta'];
    let possible_hundreds = ['','centi','ducenti','trecenti','quadringenti','quingenti','sescenti','septingenti','octingenti','nongenti'];
    let ones_num = mod(n, 10);
    let ones = possible_ones[ones_num];
    let tens_num = mod(Math.floor(n / 10), 10);
    let tens = possible_tens[tens_num];
    let hundreds_num = Math.floor(n / 100);
    let hundreds = possible_hundreds[hundreds_num];

    // apply marks to the ones component
    let markable = ['tre','se','septe','nove'];
    if (markable.includes(ones)) {
      // find marks that need to be applied
      let marks = {
        '':[],'un':[],'duo':[],'tre':[],'quattuor':[],'quin':[],'se':[],'septe':[],'octo':[],'nove':[],
        'deci':['N'],'viginti':['M','S'],'triginta':['N','S'],'quadraginta':['N','S'],'quinquaginta':['N','S'],'sexaginta':['N'],'septuaginta':['N'],'octoginta':['M','X'],'nonaginta':[],
        'centi':['NX'],'ducenti':['N'],'trecenti':['N','S'],'quadringenti':['N','S'],'quingenti':['N','S'],'sescenti':['N'],'septingenti':['N'],'octingenti':['M','X'],'nongenti':[]
      };
      let applied_marks = marks[tens];
      if (tens == '') {
        applied_marks = marks[hundreds];
      }

      // apply them
      if (applied_marks.includes('S')) {
        if (ones == 'tre') { ones = 'tres'; }
        if (ones == 'se') { ones = 'ses'; }
      }
      if (applied_marks.includes('X')) {
        if (ones == 'tre') { ones = 'tres'; }
        if (ones == 'se') { ones = 'sex'; }
      }
      if (applied_marks.includes('M')) {
        if (ones == 'septe') { ones = 'septem'; }
        if (ones == 'nove') { ones = 'novem'; }
      }
      if (applied_marks.includes('N')) {
        if (ones == 'septe') { ones = 'septen'; }
        if (ones == 'nove') { ones = 'noven'; }
      }
    }
	// add 'illi' at the end of names such as 'quadraginta' that don't have it already
    // the only ones that would already have 'illi' at the end are covered by 'small_illions' at the start of the function
    let str = ones + tens + hundreds;
    str = str.slice(0, -1) + 'illi';

    return str;
  }
	
	function get_abbreviated_illion(n) {
    let abbreviated_illions = ['K','M','B','T','qd','Qn','sx','Sp','O','N','D','uD','dD','tD','qdD','QnD','sxD','SpD','OD','ND','Vg','uVg','dVg','tVg','qdVg','QnVg','sxVg','SpVg','OVg','NVg','Tg','uTg','dTg','tTg','qdTg','QnTg','sxTg','SpTg','OTg','NTg','qg','uqg','dqg','tqg','qdqg','Qnqg','sxqg','Spqg','Oqg','Nqg','Qg'];
    if (n >= abbreviated_illions.length) {
      return '×10^' + (3 * n + 3);
    }
    return abbreviated_illions[n];
  }
  
	class AlfakmaUtils {
    getInfo() {
      return {
        id: 'alfakmautils',
        name: 'Alfakma Utils',
        color1: '#ea7575',
        color2: '#b66464',
        color3: '#9f6565',
        blocks: [
          // BLOCKS
		  {
            opcode: "whenKeyAction",
            blockType: Scratch.BlockType.HAT,
            text: "when [KEY_OPTION] key [ACTION]",
            isEdgeActivated: true,
            arguments: {
              KEY_OPTION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "space",
                menu: "keyboardButtons",
              },
              ACTION: {
                type: Scratch.ArgumentType.STRING,
                menu: "action",
              }
            }
          },
		  '---',
		  {
            opcode: 'englishlocale',
            blockType: Scratch.BlockType.REPORTER,
            text: 'format [NUMBER] with english locale',
            arguments: {
              NUMBER: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10000
              }
            }
          },
		  {
            opcode: 'spanishlocale',
            blockType: Scratch.BlockType.REPORTER,
            text: 'format [NUMBER] with spanish locale',
            arguments: {
              NUMBER: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10000
              }
            }
          },
		  {
            opcode: 'decimalplaces',
            blockType: Scratch.BlockType.REPORTER,
            text: 'format [NUMBER] with [DECIMALS] decimal places',
            arguments: {
              NUMBER: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3.14159
              },
              DECIMALS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2
              }
            }
          },
		  {
            opcode: 'formatPercentage',
            blockType: Scratch.BlockType.REPORTER,
            text: 'format [NUMBER] to percent with [DECIMALS] decimals',
            arguments: {
              NUMBER: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.5
              },
              DECIMALS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            }
          },
		  '---',
		  {
            opcode: 'randominteger',
            blockType: Scratch.BlockType.REPORTER,
            text: 'random int number [Rand1] to [Rand2]',
            arguments: {
              Rand1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              Rand2: {
				type: Scratch.ArgumentType.NUMBER,
				defaultValue: 5
			  }	
            }
		  },
		  {
            opcode: 'convertnumtoillion',
            blockType: Scratch.BlockType.REPORTER,
            text: 'convert [NUMBER] to [FORMAT] illion',
            arguments: {
              NUMBER: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1000000
              },
              FORMAT: {
              	type: Scratch.ArgumentType.STRING,
                menu: 'ILLION_NUMBER_MENU'
              }
            }
		  },
		  {
            opcode: 'clamp',
            blockType: Scratch.BlockType.REPORTER,
            text: 'clamp [NUMBER] between [MIN] and [MAX]',
            arguments: {
              NUMBER: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 20
              },
              MIN: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              MAX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 15
              }
            }
		  },
		  {
            opcode: 'numtonearest',
            blockType: Scratch.BlockType.REPORTER,
            text: '[TYPE] [A] to the nearest [B]',
            arguments: {
              A: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2763
              },
              B: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'ROUND_TYPES_MENU'
              }
            }
          },
		  {
            opcode: 'converttemperature',
            blockType: Scratch.BlockType.REPORTER,
            text: '[NUM] [A] to [B]',
            arguments: {
			  NUM: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 15
              },
              A: {
                type: Scratch.ArgumentType.STRING,
                menu: 'TEMPERATURE_MENU',
              },
              B: {
                type: Scratch.ArgumentType.STRING,
				defaultValue: 'fahrenheit',
                menu: 'TEMPERATURE_MENU' 
              }
            }
          },
		  '---',
		  {
            opcode: 'factorial',
            blockType: Scratch.BlockType.REPORTER,
            text: '[F]!',
            arguments: {
              F: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              }
            }
          },
		  {
            opcode: "colorto",
            blockType: Scratch.BlockType.REPORTER,
            text: "color [COLOR] to [TYPE]",
            arguments: {
              COLOR: {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: "#2763FF",
              },
			  TYPE: {
				type: Scratch.ArgumentType.STRING,
				menu: "COLOR_MENU",
			  }
            }
          },
		  {
            opcode: 'extramath',
            blockType: Scratch.BlockType.REPORTER,
            text: '[A] [MATH] [B]',
            arguments: {
              A: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              },
              B: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              },
              MATH: {
                type: Scratch.ArgumentType.STRING,
                menu: 'EXTRA_MATH_MENU'
              }
            }
          },
		  {
            opcode: 'extramathoneinput',
            blockType: Scratch.BlockType.REPORTER,
            text: '[MATH] [A]',
            arguments: {
              A: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 6
              },
              MATH: {
                type: Scratch.ArgumentType.STRING,
                menu: 'EXTRA_MATH_ONE_INPUT_MENU'
              }
            }
          },
		  {
            opcode: 'extralogic',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[A] [LOGIC] [B]',
            arguments: {
              A: {
                type: Scratch.ArgumentType.BOOLEAN
              },
              B: {
                type: Scratch.ArgumentType.BOOLEAN
              },
              LOGIC: {
                type: Scratch.ArgumentType.STRING,
                menu: 'EXTRA_LOGIC_MENU'
              }
            }
          },
          {
            opcode: 'extraopt',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[A] [OPT] [B]',
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 1
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 3
              },
              OPT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'EXTRA_OPT_MENU'
              }
            }
          },
		  '---',
		  {
            opcode: 'getvar',
            blockType: Scratch.BlockType.REPORTER,
            text: 'var [VARIABLE]',
            arguments: {
              VARIABLE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'VARIABLES_MENU'
              }
            }
          },
          {
            opcode: 'setvar',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set var [VARIABLE] to [VALUE]',
            arguments: {
              VARIABLE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'VARIABLES_MENU'
              },
              VALUE: {
              	type: Scratch.ArgumentType.STRING,
                defaultValue: 0
              }
            }
          },
          {
            opcode: 'modifyvar',
            blockType: Scratch.BlockType.COMMAND,
            text: '[VARIABLE] [OPT] [VALUE]',
            arguments: {
              VARIABLE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'VARIABLES_MENU'
              },
              VALUE: {
              	type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              OPT: {
              	type: Scratch.ArgumentType.STRING,
                menu: 'ASSIGNMENT_OPT_MENU'
              }
            }
          },
		  '---',
		  {
            opcode: 'baseblock',
            blockType: Scratch.BlockType.REPORTER,
            text: '[A] from base [B] to base [C]',
            arguments: {
              A: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '10',
              },
              B: {
                type: Scratch.ArgumentType.STRING,
                menu: 'BASE_MENU',
                defaultValue: '10',
              },
              C: {
                type: Scratch.ArgumentType.STRING,
                menu: 'BASE_MENU',
              }
            }
          },
		  '---',
		  {
            opcode: 'getOS',
            blockType: Scratch.BlockType.REPORTER,
            text: 'operating system',
          },
          {
            opcode: 'getBrowser',
            blockType: Scratch.BlockType.REPORTER,
            text: 'browser',
          }
		],
		menus: {
		  keyboardButtons: {
            acceptReporters: true,
            items: validKeyboardInputs,
          },
          action: {
            acceptReporters: false,
            items: ['hit','released']
          },
          ILLION_NUMBER_MENU: {
          	acceptReporters: true,
            items: ['Normal','Abbreviated','n\'th ']
          },
		  ROUND_TYPES_MENU: {
            acceptReporters: true,
            items: ['round','floor','ceiling']
          },
		  EXTRA_MATH_MENU: {
            acceptReporters: true,
            items: ['//','^','ln','√','abs diff','+','-','*','/','%','bitwise AND','bitwise XOR','bitwise OR']
          },
		  EXTRA_MATH_ONE_INPUT_MENU: {
            acceptReporters: true,
            items: ['-','abs of','sign of','√','∛','∜','10^','e^','log10 of','ln of','round','floor','ceiling','negative abs of','sin (trig radians) of','cos (trig radians) of','tan (trig radians) of','asin (trig radians) of','acos (trig radians) of','atan (trig radians) of']
          },
		  EXTRA_LOGIC_MENU: {
            acceptReporters: true,
            items: ['≠','=','and','or','nand','nor','but not']
          },
          EXTRA_OPT_MENU: {
            acceptReporters: true,
            items: ['=','≠','<','>','≤','≥','≈','≉','===','=≠=']
          },
		  COLOR_MENU: {
			acceptReporters: true,
			items: ['hex','red','green','blue','decimal']
		  },
		  VARIABLES_MENU: {
            acceptReporters: true,
            items: 'getvariables'
          },
          ASSIGNMENT_OPT_MENU: {
            acceptReporters: true,
            items: ['increment','decrement','multiple','divide']
          },
		  BASE_MENU: {
            acceptReporters: true,
            items: bases
          },
		  TEMPERATURE_MENU: {
            acceptReporters: true,
            items: ['celcius','fahrenheit','kelvin','reamur']
          }
        }
	  };	
	}
	
		getvariables() {
		  return get_variables_for_menu();
		}
		whenKeyAction(args, util) {
		  const key = Scratch.Cast.toString(args.KEY_OPTION).toLowerCase();
		  const pressed = util.ioQuery("keyboard", "getKeyIsDown", [key]);
		  return args.ACTION === "released" ? !pressed : pressed;
		}
		englishlocale(args) {
		  return Scratch.Cast.toNumber(args.NUMBER).toLocaleString('en-US');
		}
		spanishlocale(args) {
		  return Scratch.Cast.toNumber(args.NUMBER).toLocaleString('es-ES');
		}
		randominteger(args) {
			let a = args.Rand1;
			let b = args.Rand2;
			return getRandInt(a, b);
		}
		decimalplaces(args) {
			return Scratch.Cast.toNumber(args.NUMBER).toFixed(Scratch.Cast.toNumber(args.DECIMALS));
		}
		factorial(args) {
			let f = Scratch.Cast.toNumber(args.F);
			return fact(f);
		}
		formatPercentage(args) {
		  const number = Scratch.Cast.toNumber(args.NUMBER);
		  return `${(number * 100).toFixed(Scratch.Cast.toNumber(args.DECIMALS))}%`;
		}
		clamp(args) {
		  const num = Scratch.Cast.toNumber(args.NUMBER);
		  const min = Scratch.Cast.toNumber(args.MIN);
		  const max = Scratch.Cast.toNumber(args.MAX);
		  
		  // swap stuff
		  if (min > max) {
			[min, max] = [max, min];
		  }
		  
		  return Math.min(Math.max(num, min), max);
		}
		convertnumtoillion(args) {
		let num = Scratch.Cast.toNumber(args.NUMBER);
		let format = args.FORMAT;
		let neg_sign = '';
		if (num < 0) {
			neg_sign = '-';
			num = Math.abs(num);
		}
		if (num === Infinity) {
			return neg_sign + 'Infinity';
		  }

		  num = Math.round(num*10000000)/10000000; // any more precision risks floating point errors
		  
		    if (format == 'Normal' || (format == 'Abbreviated')) {
			let illion_index = Math.floor(Math.log10(num) / 3) - 1;
			let illion = null;
			if (format == 'Abbreviated') {
			  illion = ' ' + get_abbreviated_illion(illion_index);
			} else {
			  illion = ' ' + get_illion(illion_index);
			}
			let number_part = num / (10 ** ((illion_index + 1) * 3));
			number_part = Math.floor(number_part * 100) / 100;
			return neg_sign + number_part.toString() + illion;
			} else if (format == 'n\'th ') { 
		     return neg_sign + get_illion(num);
			}
			return '0';
		}
		numtonearest(args) {
		  let a = Scratch.Cast.toNumber(args.A);
		  let b = Scratch.Cast.toNumber(args.B);
		  if (args.TYPE == 'round') {
			return Math.round(a / b) * b;
		  } else if (args.TYPE == 'floor') {
			return Math.floor(a / b) * b;
		  } else if (args.TYPE == 'ceiling') {
			return Math.ceil(a / b) * b;
		  } else {
			return 0;
		  }
		}
		converttemperature(args) {
		  let temp = Scratch.Cast.toNumber(args.NUM);
		  let mathA = args.A;
		  let mathB = args.B;
		  if (args.A == 'celcius' && (args.B == 'fahrenheit')) {
			return (9/5)* temp + 32;
		  } else if (mathA == 'fahrenheit' && (mathB == 'celcius')) {
			return (5/9)* temp - 32;
		  } else if (mathA == 'celcius' && (mathB == 'reamur')) {
			return (4/5)* temp;
		  } else if (mathA == 'reamur' && (mathB == 'celcius')) {
			return (5/4)* temp;
		  } else if (mathA == 'fahrenheit' && (mathB == 'reamur')) {
			return (4/9)* temp - 32;
		  } else if (mathA == 'reamur' && (mathB == 'fahrenheit')) {
			return (9/4)* temp + 32;
		  } else if (mathA == 'kelvin' && (mathB == 'celcius')) {
			return temp - 273.15;
		  } else if (mathA == 'celcius' && (mathB == 'kelvin')) {
			return temp + 273.15;
		  } else if (mathA == 'kelvin' && (mathB == 'fahrenheit')) {
			return (temp - 273.15) * (9/5) + 32;
		  } else if (mathA == 'fahrenheit' && (mathB == 'kelvin')) {
			return (temp + 273.15) * (5/9) - 32;
		  } else if (mathA == 'kelvin' && (mathB == 'reamur')) {
			return (temp - 273.15) * (4/5);
		  } else if (mathA == 'reamur' && (mathB == 'kelvin')) {
			return (temp + 273.15) * (5/4);
		  } else {
			return 0;
		  }
		}
		colorto(args) {
		  if (args.TYPE === 'hex') {
			return args.COLOR;
		  } else if (args.TYPE == 'red') {
			return Scratch.Cast.toRgbColorObject(args.COLOR).r;
		  } else if (args.TYPE == 'green') {
			return Scratch.Cast.toRgbColorObject(args.COLOR).g;
		  } else if (args.TYPE == 'blue') {
			return Scratch.Cast.toRgbColorObject(args.COLOR).b;
		  } else if (args.TYPE == 'decimal') {
			let red = Scratch.Cast.toRgbColorObject(args.COLOR).r;
			let green = Scratch.Cast.toRgbColorObject(args.COLOR).g;
			let blue = Scratch.Cast.toRgbColorObject(args.COLOR).b;
			return blue + (green * 256) + (red * 65536);
		  } else {
			return '';
		  }
		}
		extramath(args) {
		  let a = Scratch.Cast.toNumber(args.A);
		  let b = Scratch.Cast.toNumber(args.B);
		  if (args.MATH == '//') {
			return Math.floor(a / b);
		  } else if (args.MATH == '^') {
			return a ** b;
		  } else if (args.MATH == 'ln') {
			return Math.log(b) / Math.log(a);
		  } else if (args.MATH == '√') {
			return b ** (1/a);
		  } else if (args.MATH == 'abs diff') {
			return Math.abs(a - b);
		  } else if (args.MATH == '+') {
			return a + b;
		  } else if (args.MATH == '-') {
			return a - b;
		  } else if (args.MATH == '*') {
			return a * b;
		  } else if (args.MATH == '/') {
			return a / b;
		  } else if (args.MATH == '%') {
			return mod(a,b);
		  } else if (args.MATH == 'bitwise AND') {
			return a & b;
		  } else if (args.MATH == 'bitwise XOR') {
			return a ^ b;
		  } else if (args.MATH == 'bitwise OR') {
			return a | b;
		  } else {
			return 0;
		  }
		}
		extramathoneinput(args) {
		  let a = Scratch.Cast.toNumber(args.A);
		  if (args.MATH == '-') {
			return 0 - a;
		  } else if (args.MATH == 'abs of') {
			return Math.abs(a);
		  } else if (args.MATH == 'sign of') {
			if (a > 0) {
			  return 1;
			} else if (a < 0) {
			  return -1;
			} else {
			  return 0;
			}
		  } else if (args.MATH == '10^') {
			return 10 ** a;
		  } else if (args.MATH == 'e^') {
			return Math.exp(a);
		  } else if (args.MATH == '√') {
			return Math.sqrt(a);
		  } else if (args.MATH == '∛') {
			return Math.cbrt(a);
		  } else if (args.MATH == '∜') {
			return a ** 0.25;
		  } else if (args.MATH == 'log10 of') {
			return Math.log10(a);
		  } else if (args.MATH == 'ln of') {
			return Math.log(a);
		  } else if (args.MATH == 'sin (trig radians) of') {
			return Math.sin(a);
		  } else if (args.MATH == 'cos (trig radians) of') {
			return Math.cos(a);
		  } else if (args.MATH == 'tan (trig radians) of') {
			return Math.tan(a);
		  } else if (args.MATH == 'asin (trig radians) of') {
			return Math.asin(a);
		  } else if (args.MATH == 'acos (trig radians) of') {
			return Math.acos(a);
		  } else if (args.MATH == 'atan (trig radians) of') {
			return Math.atan(a);
		  } else if (args.MATH == 'round') {
			return Math.round(a);
		  } else if (args.MATH == 'ceiling') {
			return Math.ceil(a);
		  } else if (args.MATH == 'floor') {
			return Math.floor(a);
		  } else if (args.MATH == 'negative abs of') {
			return 0 - Math.abs(a);
		  } else {
			return 0;
		  }
		}
		extralogic(args) {
		  let a = Scratch.Cast.toBoolean(args.A);
		  let b = Scratch.Cast.toBoolean(args.B);
		  if (args.LOGIC == '=') {
			return a == b;
		  } else if (args.LOGIC == '≠') {
			return a !== b;
		  } else if (args.LOGIC == 'and') {
			return a && b;
		  } else if (args.LOGIC == 'or') {
			return a || b;
		  } else if (args.LOGIC == 'nand') {
			return !(a && b);
		  } else if (args.LOGIC == 'nor') {
			return !(a || b);
		  } else if (args.LOGIC == 'but not') {
			return a && (!b);
		  } else {
			return false;
		  }
		}
		extraopt(args) {
		  let comparison = Scratch.Cast.compare(args.A,args.B);
		  let a = Scratch.Cast.toNumber(args.A);
		  let b = Scratch.Cast.toNumber(args.B);
		  if (args.OPT == '=') {
			return comparison == 0;
		  } else if (args.OPT == '≠') {
			return comparison != 0;
		  } else if (args.OPT == '<') {
			return comparison < 0;
		  } else if (args.OPT == '>') {
			return comparison > 0;
		  } else if (args.OPT == '≤') {
			return comparison <= 0;
		  } else if (args.OPT == '≥') {
			return comparison >= 0;
		  } else if (args.OPT == '≈') {
			return Math.abs(a - b) < 1;
		  } else if (args.OPT == '≉') {
			return Math.abs(a - b) >= 1;
		  } else if (args.OPT == '===') {
			return args.A === args.B;
		  } else if (args.OPT == '=≠=') {
			return args.A !== args.B;
		  } else {
			return false;
		  }
		}
		getvar(args,util) {
		  return get_var(args.VARIABLE,util);
		}
		setvar(args,util) {
		  set_var(args.VARIABLE,args.VALUE,util);
		}
		modifyvar(args,util) {
		  let a = Scratch.Cast.toNumber(get_var(args.VARIABLE,util));
		  let b = Scratch.Cast.toNumber(args.VALUE);
		  let newValue = 0;
		  if (args.OPERATOR == 'Increment') {
			newValue = a + b;
		  } else if (args.OPERATOR == 'Decrement') {
			newValue = a - b;
		  } else if (args.OPERATOR == 'Multiple') {
			newValue = a * b;
		  } else if (args.OPERATOR == 'Divide') {
			newValue = a / b;
		  }
		  set_var(args.VARIABLE,newValue.toString(),util);
		}
		baseblock({ A, B, C }) {
			bases.includes(cast.toString(B)) &&
			bases.includes(cast.toString(C))
		   {
			if (
			  new RegExp('^[' + chars_base.substring(0, cast.toNumber(B)) + ']+$').test(
				cast.toString(A)
			  )
			) {
			  return (
				parseInt(cast.toString(A), cast.toNumber(B))
				  .toString(cast.toNumber(C))
				  .toUpperCase() || '0'
			  ); // Return string zero because toString() function always return strings
			}
		  }
		  return '0'; // Return string zero because toString() function always return strings
		}
		getOS() {
		  const userAgent = navigator.userAgent;
		  if (userAgent.includes('Windows')) {
			return 'Windows';
		  } else if (userAgent.includes('Android')) {
			return 'Android';
		  } else if (
			userAgent.includes('iPhone') ||
			userAgent.includes('iPod') ||
			userAgent.includes('iPad')
		  ) {
			return 'iOS';
		  } else if (userAgent.includes('Linux')) {
			return 'Linux';
		  } else if (userAgent.includes('CrOS')) {
			return 'ChromeOS';
		  } else if (userAgent.includes('Mac OS')) {
			return 'macOS';
		  } else {
		    return 'Other';
		  }
		}
		getBrowser() {
		  const userAgent = navigator.userAgent;
		  if (userAgent.includes('Chrome')) {
			return 'Chrome';
		  } else if (userAgent.includes('Firefox')) {
			return 'Firefox';
		  } else if (userAgent.includes('Safari')) {
			return 'Safari';
		  } else if (userAgent.includes('Opera')) {
			return 'Opera';
		  } else {
		    return 'Other';
		  }
		}
	}
		
	
	 // load extension
  Scratch.extensions.register(new AlfakmaUtils());
})(Scratch);