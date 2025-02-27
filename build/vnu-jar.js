#!/usr/bin/env node

/*!
 * Script to run vnu-jar if Java is available.
 * Copyright 2017-2020 The Bootstrap Authors
 * Copyright 2017-2020 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
 */

'use strict'

const childProcess = require('child_process')
const vnu = require('vnu-jar')

childProcess.exec('java -version', (error, stdout, stderr) => {
  if (error) {
    console.error('Skipping vnu-jar test; Java is missing.')
    return
  }

  const is32bitJava = !/64-Bit/.test(stderr)

  // vnu-jar accepts multiple ignores joined with a `|`.
  // Also note that the ignores are regular expressions.
  const ignores = [
    // "autocomplete" is included in <button> and checkboxes and radio <input>s due to
    // Firefox's non-standard autocomplete behavior - see https://bugzilla.mozilla.org/show_bug.cgi?id=654072
    'Attribute “autocomplete” is only allowed when the input type is.*',
    'Attribute “autocomplete” not allowed on element “button” at this point.',
    // Markup used in Components → Forms → Layout → Form grid → Horizontal form is currently invalid,
    // but used this way due to lack of support for flexbox layout on <fieldset> element in most browsers
    'Element “legend” not allowed as child of element “div” in this context.*',
    // Modern ignore
    'Attribute “loading” not allowed on element “iframe” at this point.*',
    'Attribute “importance” not allowed on element “img” at this point.*',
    'Attribute “importance” not allowed on element “script” at this point.*',
    'Attribute “fetchpriority” not allowed on element “script” at this point.*',
    'Attribute “fetchpriority” not allowed on element “img” at this point.*',
    'Attribute “fetchpriority” not allowed on element “iframe” at this point.*',
    'Attribute “fetchpriority” not allowed on element “link” at this point.*',
    'Attribute “netlify-honeypot” not allowed on element “form” at this point.*',
    'CSS: “unicode-range”: Too many values or values are not recognized.*',
    'The “inputmode” attribute is not supported in all browsers. Please be sure to test, and consider using a polyfill.*'
  ].join('|')

  const args = [
    '-jar',
    vnu,
    '--asciiquotes',
    '--skip-non-html',
    // Ignore the language code warnings
    // '--no-langdetect',
    '--Werror',
    `--filterpattern "${ignores}"`,
    `--also-check-svg`,
    'public/'
  ]

  // For the 32-bit Java we need to pass `-Xss512k`
  if (is32bitJava) {
    args.splice(0, 0, '-Xss512k')
  }

  return childProcess.spawn('java', args, {
    shell: true,
    stdio: 'inherit'
  })
    .on('exit', process.exit)
})
