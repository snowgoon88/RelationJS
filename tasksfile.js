// Task (as Makefile or waf)
// help: npx task --help
//
// see https://github.com/pawelgalazka/tasksfile

const { sh, cli } = require('tasksfile')

function gtags( options ) {
    sh( 'find src -type f -print > gtags.files && gtags' )
}
function cleantags( option ) {
    sh( 'rm GTAGS GPATH GRTAGS gtags.files' )
}
function hello(options, name = 'Mysterious') {
  console.log(`Hello ${name}!`)
}


cli({
    hello,
    gtags,
    cleantags
})
