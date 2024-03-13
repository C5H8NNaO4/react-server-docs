// eslint-disable-next-line
import runtime from '/@react-refresh';

runtime.injectIntoGlobalHook(window);

const globalHook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
const oldCommit = globalHook.onCommitFiberRoot;
globalHook.onCommitFiberRoot = function (
  id,
  root,
  maybePriorityLevel,
  didError
) {
  try {
    if (!root.containerInfo.dataset.hacked) {
      // In SSR context, the root is considered mounted and waiting for hydration.
      // Old commit function from react-refresh would not track this root, thus,
      // disable vite hot reload. We clears the element to work around that.
      root.current.alternate.memoizedState.element = null;

      // remember this root node, as if we keep reseting, react-dev-tools won't
      // be able to work properly.
      root.containerInfo.dataset.hacked = true;
    }
  } catch (ignored) {}

  oldCommit(id, root, maybePriorityLevel, didError);
};

window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;
window.__vite_plugin_react_preamble_installed__ = true;
