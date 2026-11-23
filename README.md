# Battleship

# Setup and Local Dev Instructions

The following instructions show you how to setup and play or extend on the project locally.

First clone the git repository. Then navigate to the project's root directory.

This project uses pnpm as it's package manager (see [`package.json`](https://github.com/zachaa2/battleship/blob/main/package.json#L6)). Run the following command to install the required dependencies for this project.



```bash
pnpm install
```

To run the project locally, start the vite dev server

```bash
pnpm run dev
```

The code should also be formatted before being committed to `main`. Format via the following command in the project root.

```bash
pnpm run format
```

# Assets

Found in `public/assets`.

## Sounds

`story-sea.wav` - downloaded for free from [Mixkit](https://mixkit.co/free-sound-effects/sea/)

## Fonts

`VT323` - from [Google Fonts](https://fonts.google.com/specimen/VT323)

# License

- Source code: [MIT](LICENSE)
- Original assets: [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/)
- Third-party assets keep their own licenses; see [`public/assets/LICENSE.md`](public/assets/LICENSE.md)
