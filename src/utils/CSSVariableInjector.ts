import React from "react";

class CSSVariableInjector {
  static applyChildCSSVariables<
    T extends { style?: React.CSSProperties; children?: React.ReactNode },
  >(node: React.ReactElement<T>): React.ReactElement<T> {
    if (!React.isValidElement(node)) {
      throw new Error("Invalid React element provided.");
    }

    const children = React.Children.toArray(node.props.children);
    const numChildren = children.length;

    // Parent style with --numChildren CSS variable
    const parentStyle: React.CSSProperties = {
      ...(node.props.style || {}),
      "--numChildren": numChildren.toString(), // Ensure the value is a string
    };

    const updatedChildren = children.map((child, index) => {
      if (React.isValidElement(child)) {
        const childStyle: React.CSSProperties = {
          ...(child.props.style || {}),
          "--childIndex": index.toString(), // Ensure the value is a string
        };
        return React.cloneElement(
          child as React.ReactElement<{ style?: React.CSSProperties }>,
          { style: childStyle },
        );
      }
      return child;
    });

    return React.cloneElement(node, {
      style: parentStyle,
      children: updatedChildren,
    } as unknown as Partial<T>); // TODO: Fix typing issue
  }
}

export default CSSVariableInjector;
