export const HeadingComponentsBuilder =
  (type: "h1" | "h2" | "h3") =>
  ({ ...props }) => {
    const Element = type;

    return <Element {...props} id={typeof props.children === "string" ? props.children : ""} />;
  };
