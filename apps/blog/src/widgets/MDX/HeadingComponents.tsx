export const HeadingComponentsBuilder =
  (type: "h1" | "h2" | "h3") =>
  ({ ...props }) => {
    const Element = type;

    const id = Array.isArray(props.children) ? props.children[0] : props.children;

    return <Element {...props} id={id} />;
  };
