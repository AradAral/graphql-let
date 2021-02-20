import { createMacro } from 'babel-plugin-macros';
import { getPathsFromState } from './ast/ast';
import { manipulateFromCalleeExpressionsSync } from './ast/manip-from-callee-expressions';

const babelMacro = createMacro((params) => {
  const {
    references: { gql: gqlCalleePaths },
    state,
  } = params;

  try {
    const { cwd, sourceFullPath, sourceRelPath } = getPathsFromState(state);

    manipulateFromCalleeExpressionsSync(
      cwd,
      gqlCalleePaths,
      sourceRelPath,
      sourceFullPath,
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
});

export default babelMacro;
