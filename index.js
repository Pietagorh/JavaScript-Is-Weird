const fs = require('fs');

const zero = '+[]';
const one = '+!![]';

const number = n => {
  if (n === 0) return zero;
  return Array.from({length: n}, () => one).join(' + ');
}

const map = {};

const fromString = s =>s.split('').map(x => {
  if (!(x in map)) {
    const charCode = x.charCodeAt(0);
    return `([]+[])[${fromString('constructor')}][${fromString('fromCharCode')}](${number(charCode)})`;
  }
  return map[x];
}).join('+');

map.a = `(+{}+[])[${number(1)}]`;
map.b = `({}+[])[${number(2)}]`;
map.o = `({}+[])[${number(1)}]`;
map.e = `({}+[])[${number(4)}]`;
map.c = `({}+[])[${number(5)}]`;
map.t = `({}+[])[${number(6)}]`;
map[' '] = `({}+[])[${number(7)}]`;
map.f = `(![]+[])[${number(0)}]`;
map.s = `(![]+[])[${number(3)}]`;
map.r = `(!![]+[])[${number(1)}]`;
map.u = `(!![]+[])[${number(2)}]`;
map.i = `((+!![]/+[])+[])[${number(3)}]`;
map.n = `((+!![]/+[])+[])[${number(4)}]`;
map.S = `([]+([]+[])[${fromString('constructor')}])[${number(9)}]`;
map.g = `([]+([]+[])[${fromString('constructor')}])[${number(14)}]`;
map.p = `([]+(/-/)[${fromString('constructor')}])[${number(14)}]`;
map['\\'] = `(/\\\\/+[])[${number(1)}]`;
map.d = `(${number(13)})[${fromString('toString')}](${number(14)})`;
map.h = `(${number(17)})[${fromString('toString')}](${number(18)})`;
map.m = `(${number(22)})[${fromString('toString')}](${number(23)})`;
map.C = `((()=>{})[${fromString('constructor')}](${fromString('return escape')})()(${map['\\']}))[${number(2)}]`;

const compile = (err, data, filePath) => {
  if (err) {
    throw new error(err);
  }

  const directory = filePath.split("/");
  directory.pop();
  if (directory.length !== 0 && !fs.existsSync("./outputs/" + directory.join("/"))) {
    fs.mkdirSync("./outputs/" + directory.join("/"));
  }

  const compiledVersion = `(()=>{})[${fromString('constructor')}](${fromString(data)})()`;
  fs.writeFile("./outputs/" + filePath, compiledVersion,
    function(err) {
      if(err) {
        throw new error(err);
      }
      console.log("The file was saved!");
    }
  );
};

const followPath = filePath => fs.readFile("./inputs/" + filePath, 'utf8', function (err, data) {
  compile(err, data, filePath);
});

const getAllFiles = (directory = "") => fs.readdir("./inputs/" + directory, function (err, files) {
  if (err) {
    throw new error(err);
  }
  for (const file of files) {
    if (fs.statSync("./inputs/" + directory + file).isDirectory()) getAllFiles(directory + file + "/");
    else {
      console.log('OK: ' + directory + file);
      followPath(directory + file);
    }
  }
});

const deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file) {
      const curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

deleteFolderRecursive("./outputs/");
fs.mkdirSync("./outputs/");
getAllFiles();