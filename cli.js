#!/usr/bin/env node

"use strict"

const path = require("path")
const typedoc = require("typedoc")
const tempy = require("tempy")
const meow = require("meow")
const open = require("open")
const chalk = require("chalk")

module.exports = (() => {
	const cli = meow(`
    Usage
      $ tedo <input>

    Examples
	  $ tedo index.js
      $ tedo lodash
`)

	if (cli.input.length === 0) {
		console.log(chalk.red("Please specify a module!"))
		return
	}

	const outPath = tempy.directory()
	const filePaths = cli.input

	const app = new typedoc.Application()

	app.options.setValues({
		allowJs: true,
		ignoreCompilerErrors: true,
		module: "commonjs",
		exclude: "*/+(typescript|@types)/**",
		includeDeclarations: true,
		mode: "file",
		allowSyntheticDefaultImports: true,
		esModuleInterop: true,
		declaration: true,
		types: cli.input,
		...cli.flags,
	})

	app.logger.log = (message, level, newLine) => {
		if (newLine) message += "\n"
		if (level === 3) console.log(chalk.red(message))
		if (level === 2) console.log(chalk.yellow(message))
	}

	app.generateDocs(filePaths, outPath)

	open(path.resolve(outPath, "index.html"))

	console.log(chalk.green("Successfully generated documentation!"))
})()
