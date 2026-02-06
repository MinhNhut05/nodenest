/**
 * SESSION 1.3.1 - process.argv
 * Command Line Arguments (Tham số dòng lệnh)
 *
 * process.argv là array chứa các arguments khi chạy node
 */

// ============================================
// 1. ARGV CƠ BẢN
// ============================================

console.log('=== Raw process.argv ===\n');
console.log(process.argv);

// argv[0] = đường dẫn tới node executable
// argv[1] = đường dẫn tới file đang chạy
// argv[2+] = các arguments truyền vào

console.log('\n--- Chi tiết ---');
console.log('Node path:', process.argv[0]);
console.log('Script path:', process.argv[1]);
console.log('User args:', process.argv.slice(2));

// ============================================
// 2. LẤY ARGUMENTS CỦA USER
// ============================================

console.log('\n=== User Arguments ===\n');

// Thường dùng slice(2) để bỏ qua node path và script path
const args = process.argv.slice(2);
console.log('Args:', args);

// Ví dụ: node 02-argv.js hello world 123
// args = ['hello', 'world', '123']

// ============================================
// 3. PARSE ARGUMENTS THỦ CÔNG
// ============================================

console.log('\n=== Manual Parsing ===\n');

// Pattern 1: Positional arguments
// node script.js <action> <target>
const [action, target] = args;
console.log('Action:', action || '(none)');
console.log('Target:', target || '(none)');

// Pattern 2: Flag-based arguments
// node script.js --name John --age 25 --verbose
function parseArgs(args) {
  const result = { _: [] }; // _ chứa positional args

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      // --key=value hoặc --key value
      const key = arg.slice(2);

      if (key.includes('=')) {
        const [k, v] = key.split('=');
        result[k] = v;
      } else {
        // Check next arg
        const nextArg = args[i + 1];
        if (nextArg && !nextArg.startsWith('-')) {
          result[key] = nextArg;
          i++; // Skip next arg
        } else {
          result[key] = true; // Flag without value
        }
      }
    } else if (arg.startsWith('-')) {
      // Short flags: -v, -n John
      const key = arg.slice(1);
      const nextArg = args[i + 1];

      if (nextArg && !nextArg.startsWith('-')) {
        result[key] = nextArg;
        i++;
      } else {
        result[key] = true;
      }
    } else {
      // Positional argument
      result._.push(arg);
    }
  }

  return result;
}

const parsed = parseArgs(args);
console.log('Parsed:', parsed);

// ============================================
// 4. VÍ DỤ THỰC TẾ: SIMPLE CLI
// ============================================

console.log('\n=== Simple CLI Example ===\n');

function showHelp() {
  console.log(`
Usage: node 02-argv.js <command> [options]

Commands:
  greet <name>     Say hello to someone
  add <a> <b>      Add two numbers

Options:
  --help, -h       Show this help
  --verbose, -v    Verbose output
  `);
}

// Demo
if (parsed.help || parsed.h) {
  showHelp();
} else if (action === 'greet') {
  const name = target || 'World';
  console.log(`Hello, ${name}!`);
} else if (action === 'add') {
  const a = parseFloat(target) || 0;
  const b = parseFloat(args[2]) || 0;
  console.log(`${a} + ${b} = ${a + b}`);
} else {
  console.log('No command specified. Use --help for usage.');
}

// ============================================
// THỬ CHẠY:
// ============================================
// node 02-argv.js
// node 02-argv.js --help
// node 02-argv.js greet Leminho
// node 02-argv.js add 5 3
// node 02-argv.js --name John --verbose
