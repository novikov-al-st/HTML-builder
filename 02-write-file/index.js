const { stdin, stdout } = process;
const path = require('path');
const fs = require('fs');
const fileName = 'result.txt';
const textExitArray = ['exit\r\n', 'exit\n', 'exit\r'];
const ws = new fs.WriteStream(path.resolve(__dirname, fileName), 'utf-8');

const exit = () => { 
  stdout.write(`Пока! Если вводились данные, то будут  записаны в файл пути: ${path.resolve(__dirname, fileName)}`);
  process.exit();
};

process.on('SIGINT', () => {
  exit();
});

stdout.write('Привет, напиши, пожалуйста собщенеие в файл.\n');
stdout.write('Для выхода нужно ввести текст "exit" или нажать комбинацию клавиш CTRL+C\n');

stdin.on('data', data => {
  const textLine = data.toString();
  if(textExitArray.includes(textLine)) {
    exit();
  } else {
    ws.write(data);
  }
});