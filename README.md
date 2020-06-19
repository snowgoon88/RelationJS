# RelationJS

Display, edit and manage relationships between Factions and Characters (with RPG in mind).

## Planned features
- Factions : create, edit
- Relations : create, edit
- Character : create, edit, can belong to several Factions
- display as nice graph, where information can be folded up.
- export as SVG and PDF and serialize (JSON ?, TXT?, other)

## build and run
- `npx babel src --out-dir lib`
- `relations.html`: current application
- `test_XXX.html`: test various features, development tools

## Depends on
- FabricJS : lib/fabric.js OR lib/fabric.min.js
- React : lib/react-dom.js AND lib/react.js

## Thoughts
- I first tried to use cytoscape.js as "Compound Nodes" seemed everything I needed but then it turned out that one Character can only have one Faction (parent in cytoscape).
- So, decided to use Fabric.js (over Two.js) as graphical backend, as it has Events.

