#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const Terser = require('terser');

function showHelp() {
    console.log(`
Description:
Bundle is a script that bundles multiple JavaScript files into one file and optionally minifies it.

Usage:
bundle <options> [... list of source JavaScript files]

Options:
--minify: removes all unnecessary characters from JavaScript source code without altering its functionality
--out: specifies the path of the output bundled file
--help: shows this help message
    `);
}

function bundleFiles(files, outputPath, minify) {
    let bundledCode = '';

    files.forEach(file => {
        if (fs.existsSync(file)) {
            bundledCode += fs.readFileSync(file, 'utf-8') + '\n';
        } else {
            console.error(`File not found: ${file}`);
            process.exit(1);
        }
    });

    if (minify) {
        Terser.minify(bundledCode).then(result => {
            fs.writeFileSync(outputPath, result.code);
            console.log(`Bundled and minified code written to ${outputPath}`);
        }).catch(err => {
            console.error('Error during minification:', err);
            process.exit(1);
        });
    } else {
        fs.writeFileSync(outputPath, bundledCode);
        console.log(`Bundled code written to ${outputPath}`);
    }
}

program
    .version('1.0.0')
    .description('A CLI tool for bundling JavaScript files.')
    .option('--minify', 'Minify the bundled code')
    .option('--out <path>', 'Specify the output file path')
    .parse(process.argv);

const options = program.opts();
const outputPath = options.out || 'bundle.js';
const minify = options.minify;

const files = program.args;

if (files.length === 0) {
    showHelp();
    process.exit(1);
}

bundleFiles(files, outputPath, minify);
