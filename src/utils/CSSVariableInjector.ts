import React from "react";

/**
 * A utility class for injecting custom CSS variables into a JSX element
 * and its child elements. For dynamically styling elements based on their
 * structure, such as the number of children or their index.
 * This allows for math to be performed in CSS based on structure via calc,
 * such as calculating delays for staggered crossfades based on their position
 * within a container.
 */
class CSSVariableInjector {
  /**
   * Applies custom CSS variables to a React element and its children.
   *
   * The parent element gets a `--numChildren` CSS variable indicating
   * the total number of children. Each child gets a `--childIndex` CSS
   * variable reflecting its zero-based index within the parent.
   *
   * @template T - Extends the type of the element's props to include
   *               optional `style` and `children` properties.
   * @param node - A valid React element to which the CSS variables will be applied.
   * @returns A new React element with updated `style` properties on the parent
   *          and child elements.
   * @throws If the provided node is not a valid React element.
   */
  static applyChildCSSVariables<
    T extends { style?: React.CSSProperties; children?: React.ReactNode },
  >(node: React.ReactElement<T>): React.ReactElement<T> {
    // Ensure the provided node is a valid React element
    if (!React.isValidElement(node)) {
      throw new Error("Invalid React element provided.");
    }

    // Extract children from the node's props and calculate the number of children
    const children = React.Children.toArray(node.props.children);
    const numChildren = children.length;

    // Define the parent style with the `--numChildren` CSS variable
    const parentStyle: React.CSSProperties = {
      ...(node.props.style || {}), // Retain any existing styles
      "--numChildren": numChildren.toString(), // Add `--numChildren` as a string
    };

    // Iterate over the children and inject a `--childIndex` CSS variable into each
    const updatedChildren = children.map((child, index) => {
      // Check if the child is a valid React element
      if (React.isValidElement<{ style?: React.CSSProperties }>(child)) {
        const childStyle: React.CSSProperties = {
          ...(child.props.style || {}), // Retain any existing child styles
          "--childIndex": index.toString(), // Add `--childIndex` as a string
        };
        // Clone the child element with the updated `style` property
        return React.cloneElement(child, { style: childStyle });
      }
      return child; // Non-element children are returned unchanged
    });

    // Clone the parent element with the updated style and modified children
    return React.cloneElement(node, {
      style: parentStyle,
      children: updatedChildren,
    } as unknown as Partial<T>); // Typing issue workaround
  }
}

export default CSSVariableInjector;
