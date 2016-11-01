#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const process = require('process')

var rootPath
if (process.argv.length > 2) {
  rootPath = process.argv[2]
} else {
  rootPath = '.'
}

const verbose = true
scanDir(rootPath)

function scanDir (p) {
  const files = fs.readdirSync(p);
  for (var i = 0; i < files.length; i++) {
    try {
      const filePath = path.join(p, files[i])
      const stat = fs.lstatSync(filePath)
      if (stat) {
        if (stat.isDirectory()) scanDir(filePath)
        if (stat.isFile()) {
          try {
            const arch = determinePEArch(filePath)
            if (arch !== null) {
              console.log(filePath + ' is ' + arch)
            }
          } catch (err) {
            console.log(err)
          }
        }
      }
    } catch (err) { }
  }
}

function determinePEArch (fileName) {
  const fd = fs.openSync(fileName, "r")
  const buffer = new Buffer(4096)
  const bytesRead = fs.readSync(fd, buffer, 0, buffer.length, null)
  fs.closeSync(fd)

  if (bytesRead > 2) {
    const mzSig = buffer.readUInt16LE(0)
    if (mzSig === 0x5A4D) {
      return scanMZ(fileName, bytesRead, buffer)
    }
  }

  return null
}

function scanMZ (fileName, bytesRead, buffer) {
  if (bytesRead > 0x3C + 4) {
    const peOffset = buffer.readUInt32LE(0x3C)
    if (peOffset + 5 > bytesRead) {
      throw fileName + ' has MZ header but PE offset of ' + peOffset + ' outside of buffer length ' + bytesRead
    }

    const peSig = buffer.readUInt16LE(peOffset)
    if (peSig != 0x4550) {
      throw fileName + ' has MZ header but no PE header at ' + peOffset + ' [' + buffer.slice(0x3C, 0x3C+2).toString('hex') + ']'
    }

    return archIdToString(buffer.readUInt16LE(peOffset + 4))
  }

  return null
}

function archIdToString (archId) {
  switch(archId) {
    case 0:      return 'native'    // applicable to any machine type
    case 0x0EBC: return 'ebc'       // EFI byte code

    case 0x014C: return 'ia32'      // Intel 386 or later compatible processors
    case 0x0200: return 'ia64'      // Intel Itanium processor family
    case 0x8664: return 'amd64'     // AMD x64 extensions / Intel 64-bit 'Core'

    case 0x0166: return 'r4000'     // MIPS R4000 little endian
    case 0x0169: return 'wcemipsv2' // MIPS little-endian WCE v2
    case 0x0266: return 'mips16'    // MIPS16
    case 0x0366: return 'mipsfpu'   // MIPS with FPU
    case 0x0466: return 'mipsfpu16' // MIPS16 with FPU

    case 0x01A1: return 'sh3'       // Hitachi SH3
    case 0x01A3: return 'sh3dsp'    // Hitachi SH3 DSP
    case 0x01A6: return 'sh4'       // Hitachi SH4
    case 0x01A8: return 'sh5'       // Hitachi SH5

    case 0x01F0: return 'powerpc'   // Power PC little endian
    case 0x01F1: return 'powerpcfp' // Power PC with floating point support

    case 0x01C0: return 'arm'       // ARM little endian
    case 0x01C2: return 'thumb'     // ARM Thumb
    case 0x01C4: return 'armnt'     // ARM Thumb-2 little endian
    case 0xAA64: return 'arm64'     // ARM64 little endian

    case 0x5032: return 'riscv32'   // RISC-V 32-bit address space
    case 0x5064: return 'riscv64'   // RISC-V 64-bit address space
    case 0x5128: return 'riscv128'  // RISC-V 128-bit address space

    case 0x01D3: return 'am33'      // Matsushita AM33
    case 0x9041: return 'm32r'      // Mitsubishi M32R little endian

    default:     return 'invalid (' + archId.toString(16) + ')'
  }
}

module.exports = {
  determinePEArch: determinePEArch
}
