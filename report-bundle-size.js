#!/usr/bin/env node

/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

// edited to work with the appdir by @raphaelbadia

import gzSize from "gzip-size"
import { mkdirp } from "mkdirp"
import fs from "fs"
import path from "path"
import { createRequire } from "module"

// Create a require instance for JSON files and package logic
const require = createRequire(import.meta.url)

// Pull options from `package.json`
const options = getOptions()
const BUILD_OUTPUT_DIRECTORY = getBuildOutputDirectory(options)

// first we check to make sure that the build output directory exists
const nextMetaRoot = path.join(process.cwd(), BUILD_OUTPUT_DIRECTORY)
try {
  fs.accessSync(nextMetaRoot, fs.constants.R_OK)
} catch (err) {
  console.error(
    `No build output found at "${nextMetaRoot}" - you may not have your working directory set correctly, or not have run "next build".`
  )
  process.exit(1)
}

// Using fs.readFileSync + JSON.parse for ESM compatibility with JSON files
const buildMeta = JSON.parse(fs.readFileSync(path.join(nextMetaRoot, "build-manifest.json"), "utf8"))
const appDirMeta = JSON.parse(fs.readFileSync(path.join(nextMetaRoot, "app-build-manifest.json"), "utf8"))

// this memory cache ensures we dont read any script file more than once
const memoryCache = {}

// since _app is the template that all other pages are rendered into,
// every page must load its scripts. we'll measure its size here
const globalBundle = buildMeta.pages["/_app"]
const globalBundleSizes = getScriptSizes(globalBundle)

// next, we calculate the size of each page's scripts, after
// subtracting out the global scripts
const allPageSizes = Object.values(buildMeta.pages).reduce((acc, scriptPaths, i) => {
  const pagePath = Object.keys(buildMeta.pages)[i]
  const scriptSizes = getScriptSizes(scriptPaths.filter((scriptPath) => !globalBundle.includes(scriptPath)))

  acc[pagePath] = scriptSizes

  return acc
}, {})

const globalAppDirBundle = buildMeta.rootMainFiles || []
const globalAppDirBundleSizes = getScriptSizes(globalAppDirBundle)

const allAppDirSizes = Object.values(appDirMeta.pages).reduce((acc, scriptPaths, i) => {
  const pagePath = Object.keys(appDirMeta.pages)[i]
  const scriptSizes = getScriptSizes(scriptPaths.filter((scriptPath) => !globalAppDirBundle.includes(scriptPath)))
  acc[pagePath] = scriptSizes

  return acc
}, {})

// format and write the output
const rawData = JSON.stringify({
  ...allAppDirSizes,
  __global: globalAppDirBundleSizes,
})

// log outputs to the gh actions panel
mkdirp.sync(path.join(nextMetaRoot, "analyze/"))
fs.writeFileSync(path.join(nextMetaRoot, "analyze/__bundle_analysis.json"), rawData)

// --------------
// Util Functions
// --------------

function getScriptSizes(scriptPaths) {
  return scriptPaths.reduce(
    (acc, scriptPath) => {
      const [rawSize, gzipSize] = getScriptSize(scriptPath)
      acc.raw += rawSize
      acc.gzip += gzipSize

      return acc
    },
    { raw: 0, gzip: 0 }
  )
}

function getScriptSize(scriptPath) {
  const encoding = "utf8"
  const p = path.join(nextMetaRoot, scriptPath)

  if (memoryCache[p]) {
    return memoryCache[p]
  }

  const textContent = fs.readFileSync(p, encoding)
  const rawSize = Buffer.byteLength(textContent, encoding)
  const gzipSize = gzSize.sync(textContent)
  
  const result = [rawSize, gzipSize]
  memoryCache[p] = result
  return result
}

function getOptions(pathPrefix = process.cwd()) {
  const pkg = JSON.parse(fs.readFileSync(path.join(pathPrefix, "package.json"), "utf8"))
  return { ...pkg.nextBundleAnalysis, name: pkg.name }
}

function getBuildOutputDirectory(options) {
  return options.buildOutputDirectory || ".next"
}