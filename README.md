# Minecraft Recipe Graph Generator

Creates a graph and visualization of the recipes contained in a set of mods and
minecraft version.

## Setting up the environment

### Install tooling:

Use [asdf](https://asdf-vm.com/):

```bash
asdf install
```

Or install [nodejs](https://nodejs.org/) however you want. Use the version
listed in the file `.tool-versions`

### Install packages

Use [npm](https://www.npmjs.com/), [yarn](https://yarnpkg.com/) or
[pnpm](https://pnpm.io/) to install the packages:

```bash
npm install
yarn install
pnpm install
```

## Creating a graph

### Extracting recipes

Put your minecraft `jar` file and mods `jar` files in `jar` folder.

Run the recipes extractor:

```bash
npm run extract-recipes
# OR
yarn run extract-recipes
# OR
pnpm extract-recipes
```

### Generating the graph (WIP)

After extracting the recipes, run the graph generator program:

```bash
npm run generate-graph
# OR
yarn run generate-graph
# OR
pnpm generate-graph
```

## Running the web interface (Not implemented)

Not implemented yet

## TODO

- [x] Create recipe extractor script
- [ ] Create graph generator script
- [ ] Create base website
- [ ] Add graph visualization to the website
- [ ] Add search feature
- [ ] Add crafting path finder (from item to another item)
- [ ] Increment search feature to filter by mod (like item search in game using @)
- [ ] Change graph to show the blocks in the nodes (more visually appealing)
- [ ] Transform into a deployable website so everyone may use it without installing
- [ ] Add support to CurseForge modpacks

## Contributing

This repository is not available yet for collaboration, this is mostly a hobby
and I do not have the time to manage people.
