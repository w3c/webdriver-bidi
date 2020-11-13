/**
 * Helper function to iterate through the parsed spec document and
 * filter out all `<pre>` nodes with class `cddl`, e.g.
 * ```
 * <pre class="cddl remote-cddl">...</pre>
 * <pre class="cddl local-cddl">...</pre>
 * ```
 * 
 * @param {[Document] | DefaultTreeNode[]} nodes tree nodes
 * @return {
 *   {
 *     nodeClass: string,
 *     content: string[]
 *   }[]
 * } a list of pre texts
 */
function getCDDLNodes (nodes) {
    return nodes.map((node) => {
        if (node.nodeName === 'pre') {
            const nodeClass = node.attrs.find((attr) => attr.name === 'class')
            const content = node.childNodes.map((child) => child.value).join('')

            if (nodeClass && nodeClass.value.includes('cddl')) {
                return { nodeClass: nodeClass.value.split(' ').pop(), content }
            }
        }

        if (!node.childNodes) {
            return
        }

        return getCDDLNodes(node.childNodes)
    }).flat().filter(Boolean)
}

module.exports = { getCDDLNodes }