export const HeadingComponentsBuilder =
  (type: "h1" | "h2" | "h3") =>
  ({ ...props }) => {
    const Element = type;

    const id = parseIdToHeading(props.children);

    return <Element {...props} id={id} />;
  };

export const parseIdToHeading = (children: any) => {
  if (Array.isArray(children)) return children[0];
  if (children.type === "code") return children.props.children;

  return children;
};
