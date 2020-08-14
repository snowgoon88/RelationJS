// Task (as Makefile or waf)
// help: npx task --help
//
// see https://github.com/pawelgalazka/tasksfile

const { sh, cli, help } = require('tasksfile')

function gtags( options ) {
    sh( 'find src -type f -print > gtags.files && gtags' )
}
help( gtags, 'Regenerate GTAGS')

function cleantags( option ) {
    sh( 'rm GTAGS GPATH GRTAGS gtags.files' )
}
help( cleantags, 'Remove GTAGS files etc...' )

function build( options ) {
    sh( 'npx babel src --out-dir lib' )
}
help( build, 'Use babel to build .js files' )

function hello(options, name = 'Mysterious') {
  console.log(`Hello ${name}!`)
}


cli({
    hello,
    gtags,
    cleantags,
    build
})
