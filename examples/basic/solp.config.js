module.exports = {
    compilers: {
     solc: {
       version: "0.8.21",      // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
       }
  },
  processEnv: true,  // Should preprocessor add the environment variables or not
  macroPrefix: "#", // Use custom prefix for the macro commands
  singleLineComment: /^\s*\/\//, // regex for the single-line comments before the macro commands
  multiLineComment: {  
      start: /^\s*\/\*+/, // regex for the begin of the multi-line comments for the macro commands
      row: /^\s*\*+/, // regex for the internal rows of the multi-line comments for the macro commands
      end: /\s*\*+\/\s*$/, // regex for the end of the multi-line comments for the macro commands
  },
  trimSingleLine: true,  // delete empty lines appeared during macro processing
}