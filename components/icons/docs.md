# Icon Documentation

The icons in this folder are just SVG files wrapped in a React component.

Our primary source for icons is [Hero Icons](https://heroicons.com/).

# Choosing and Adding an Icon

1. Choose a solid icon from the [Hero Icons](https://heroicons.com/) website.
2. Click copy JSX.
3. Paste the JSX into a file in this folder, with the same name as the icon. The case of the component file should be **CamelCase**.
4. Add a `{...rest}` prop to the component.
5. Add `{...rest}` to the SVG element.

# If required icon is not on Hero Icons

Select any matching 'fill' icon from [React Icons](https://marketplace.visualstudio.com/items?itemName=afzalsayed96.reacticons) VSCode extension.
It should match the other icons, not look too outlandish.
