# MTG Proxy Maker

> **Warning**
> This tool is **not efficient**, **simple to use** nor **complete**
> I made it for my own usage and it suffers a lot of problems for now

This tool enables the creation of high resolution Magic proxy cards in `.svg` format and `.html` ready to print.

## What can it do ?

- Parse card list in MTGO format
- Creates high resolution of cards, even non-english one
- Creates separate svg files for each card
- Creates a html page to print all cards at once
- Generates a different artwork for each basic land you want to generate (it's nicer imo)
- Cache all data so the same card doesn't render twice

## What can't it do ?

- All non-basic cards (Planeswalker, Saga etc.)
- Choosing versions of card, or editing them
- Adjust printing variables (but you can play around with CSS variables inside the html if you want)

## Usage

- Clone this repository and run `pnpm install`.
- Put a list of your cards in a file named `cards.txt` at the root of this project.
- Run `pnpm start` and you should see all your cards created inside the `out` directory
- Open `out/index.html` to see a page ready to print
- Whatever your OS, always set the printing margins to none and you scale to 100% and you should be good

## Why another tool ?

Contrary to other tools, this one doesn't rely on scans for the proxies but instead re-creates them based on the card info.

I made it because I'm french and french scans of MTG cards are often awful.  
With this tool I can get very high resolution of cards in SVG format, perfect for printing with personal printer ! (the results are very convincing so far)
