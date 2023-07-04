/**
 * Helper function to iterate through the parsed spec document and
 * filter out all `<pre>` nodes with class `cddl`, e.g.
 * ```
 * <pre class='cddl remote-cddl'>...</pre>
 * <pre class='cddl local-cddl'>...</pre>
 * ```
 *
 * @param {[Document] | DefaultTreeNode[]} nodes tree nodes
 * @param {Array<string>} local Array to fill with local CDDL definitions.
 * @param {Array<string>} remote Array to fill with remote CDDL definitions.
 */
function getCDDLNodes(nodes) {
  const entries = { local: [], remote: [], all: [] };

  nodes.forEach((node) => {
    if (node.nodeName === "pre") {
      const nodeClass = node.attrs.find((attr) => attr.name === "class");
      if (nodeClass && nodeClass.value.includes("cddl")) {
        const content = node.childNodes.map((child) => child.value).join("");

        if (nodeClass.value.includes("local-cddl")) {
          entries.local.push(content);
        }

        if (nodeClass.value.includes("remote-cddl")) {
          entries.remote.push(content);
        }

        if (
          nodeClass.value.includes("local-cddl") ||
          nodeClass.value.includes("remote-cddl")
        ) {
          entries.all.push(content);
        }
      }
    }

    if (node.childNodes) {
      const { local, remote, all } = getCDDLNodes(node.childNodes);
      entries.local.push(...local);
      entries.remote.push(...remote);
      entries.all.push(...all);
    }
  });

  return entries;
}

module.exports = { getCDDLNodes };
