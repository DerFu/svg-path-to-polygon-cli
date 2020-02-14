#!/usr/bin/env node

const {
  pathDataToPolys
} = require("../node_modules/svg-path-to-polygons/svg-path-to-polygons.js");
const meow = require("meow");
const fs = require("fs");
const chalk = require("chalk");
const log = console.log;
const clipboardy = require("clipboardy");
const xml2js = require("xml2js");
const parser = new xml2js.Parser();

const cli = meow(
  `
	Usage
	  $ svgp2p <input>

	Options
	  --file, -f  File
	  --string, -s  Path

	Examples
	  $ svgp2p -f ./example.svg
`,
  {
    flags: {
      file: {
        type: "string",
        alias: "f"
      },
      string: {
        type: "string",
        alias: "s"
      }
    }
  }
);

if (cli.flags.string) {
  const points = pathDataToPolys(cli.flags.string, {
    tolerance: 1,
    decimals: 0
  });
  clipboardy.writeSync(points.toString());
  log(chalk.green("Polygons copied to clipboard"));
  log(chalk.blue(points.toString()));
}

if (cli.flags.file) {
  fs.readFile(cli.flags.file, "utf-8", (error, text) => {
    if (error) throw error;
    parser.parseString(text, (err, result) => {
      if (err) throw err;
      const points = pathDataToPolys(result["svg"]["path"][0].$.d, {
        tolerance: 1,
        decimals: 1
      });
      clipboardy.writeSync(points.toString());
      log(chalk.green("Polygons copied to clipboard"));
    });
  });
}
