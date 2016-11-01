# binarycpu

Identify the processor architecture of binary files.

## Usage

### On the command line

Simply install with `npm install -g binarycpu` and then call this with the path you wish to scan. e.g.

`binarycpu c:\\apps`

And it will print out the file names of identified PE/MZ binary files with their appropriate cpu architecture (see table below).

### In your own code

`const binarycpu = require('binarycpu')

const arch = binarycpu.determinePEArch(filename)`

null is returned if the file is not a MZ/PE file.  If the processor architecture is unknown it will return unknown as well as the hex identifier.

## Possible architectures

These have been kept the same as the Microsoft docs for PE files.

| Hex ID | Name   | description
| ------ | ------ | -----------
| 0x0000 | native | applicable to any machine type
| 0x0EBC | ebc | EFI byte code
| 0x014C | ia32 | Intel 386 or later compatible processors
| 0x0200 | ia64 | Intel Itanium processor family
| 0x8664 | amd64 | AMD x64 extensions / Intel 64-bit 'Core'
| 0x0166 | r4000 | MIPS R4000 little endian
| 0x0169 | wcemipsv2 | MIPS little-endian WCE v2
| 0x0266 | mips16 | MIPS16
| 0x0366 | mipsfpu | MIPS with FPU
| 0x0466 | mipsfpu16 | MIPS16 with FPU
| 0x01A1 | sh3 | Hitachi SH3
| 0x01A3 | sh3dsp | Hitachi SH3 DSP
| 0x01A6 | sh4 | Hitachi SH4
| 0x01A8 | sh5 | Hitachi SH5
| 0x01F0 | powerpc | Power PC little endian
| 0x01F1 | powerpcfp | Power PC with floating point support
| 0x01C0 | arm | ARM little endian
| 0x01C2 | thumb | ARM Thumb
| 0x01C4 | armnt | ARM Thumb-2 little endian
| 0xAA64 | arm64 | ARM64 little endian
| 0x5032 | riscv32 | RISC-V 32-bit address space
| 0x5064 | riscv64 | RISC-V 64-bit address space
| 0x5128 | riscv128 | RISC-V 128-bit address space
| 0x01D3 | am33 | Matsushita AM33
| 0x9041 | m32r | Mitsubishi M32R little endian

## Notes

* Only Portable Executable files are supported (ELF, mach-O could be added later)
* Errors are thrown if it is a MZ file but it can't find the PE signature
