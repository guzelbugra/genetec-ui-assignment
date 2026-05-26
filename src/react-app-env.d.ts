declare module '*.css' {
  const src: string;
  export default src;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}