import { createMacro } from 'babel-plugin-macros';
import { getPathsFromState } from './ast/ast';
import { manipulateFromCalleeExpressions } from './ast/manip-from-callee-expressions';

const macro = createMacro((params) => {
  const {
    references: { gql: gqlCalleePaths },
    state,
  } = params;

  const { cwd, sourceFullPath, sourceRelPath } = getPathsFromState(state);

  manipulateFromCalleeExpressions(
    gqlCalleePaths,
    cwd,
    sourceRelPath,
    sourceFullPath,
  );
});

export default macro;
