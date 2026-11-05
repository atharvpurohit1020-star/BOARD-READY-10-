/**
 * Math and Chemistry programmatic verification utility
 * Runs in Node and browser for deterministic verification without LLM hallucinations.
 */

export interface MathCheckResult {
  valid: boolean;
  computedValue?: number;
  evaluatedExpr?: string;
  error?: string;
}

export interface EquationBalanceResult {
  balanced: boolean;
  reactantCounts: Record<string, number>;
  productCounts: Record<string, number>;
  error?: string;
}

export class MathSolver {
  /**
   * Safely evaluates a numeric/algebraic expression string.
   * Supports basic arithmetic, sqrt, fractions, pi = 22/7, powers.
   */
  static evaluateNumericExpr(expr: string): MathCheckResult {
    try {
      if (!expr || typeof expr !== 'string') {
        return { valid: false, error: 'Empty expression' };
      }

      // Sanitize: allow numbers, operators, parens, pi, sqrt, decimals
      let clean = expr
        .trim()
        .replace(/\\pi/g, '(22/7)')
        .replace(/pi/gi, '(22/7)')
        .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
        .replace(/\^/g, '**');

      // Security check: only allow safe mathematical characters
      if (!/^[0-9+\-*/().,Mathsqrt\s*]+$/.test(clean)) {
        return { valid: false, error: 'Expression contains disallowed characters' };
      }

      // Safe evaluation using Function
      const result = new Function(`return (${clean});`)();

      if (typeof result !== 'number' || isNaN(result) || !isFinite(result)) {
        return { valid: false, error: 'Evaluation did not yield a finite number' };
      }

      return {
        valid: true,
        computedValue: Number(result.toFixed(4)),
        evaluatedExpr: clean,
      };
    } catch (err: any) {
      return { valid: false, error: err.message || 'Syntax error in math expression' };
    }
  }

  /**
   * Checks if answer matches the computed expression within tolerance
   */
  static verifyAnswerWithExpr(answer: string, expr: string, tolerance: number = 0.05): boolean {
    const computed = this.evaluateNumericExpr(expr);
    if (!computed.valid || computed.computedValue === undefined) return false;

    // Extract first numeric token from answer string
    const match = answer.match(/[-+]?[0-9]*\.?[0-9]+/);
    if (!match) return false;

    const answerNum = parseFloat(match[0]);
    return Math.abs(answerNum - computed.computedValue) <= tolerance;
  }

  /**
   * Checks that for an MCQ, exactly ONE option matches the computed value
   */
  static verifySingleMCQMatch(options: { a: string; b: string; c: string; d: string }, computedValue: number, tolerance: number = 0.05): {
    uniqueMatch: boolean;
    matchingOption?: 'a' | 'b' | 'c' | 'd';
  } {
    const matches: ('a' | 'b' | 'c' | 'd')[] = [];
    const keys: ('a' | 'b' | 'c' | 'd')[] = ['a', 'b', 'c', 'd'];

    for (const key of keys) {
      const text = options[key];
      const match = text.match(/[-+]?[0-9]*\.?[0-9]+/);
      if (match) {
        const val = parseFloat(match[0]);
        if (Math.abs(val - computedValue) <= tolerance) {
          matches.push(key);
        }
      }
    }

    return {
      uniqueMatch: matches.length === 1,
      matchingOption: matches.length === 1 ? matches[0] : undefined,
    };
  }

  /**
   * Simple chemical equation balancer check.
   * e.g., "2H2 + O2 -> 2H2O" or "CH4 + 2O2 -> CO2 + 2H2O"
   */
  static checkChemicalBalance(equation: string): EquationBalanceResult {
    try {
      const parts = equation.split(/->|→/);
      if (parts.length !== 2) {
        return { balanced: false, reactantCounts: {}, productCounts: {}, error: 'Missing arrow in reaction' };
      }

      const parseSide = (sideStr: string) => {
        const counts: Record<string, number> = {};
        const molecules = sideStr.split('+').map(s => s.trim());

        for (const mol of molecules) {
          if (!mol) continue;
          // Match coefficient
          const coeffMatch = mol.match(/^(\d+)/);
          const coeff = coeffMatch ? parseInt(coeffMatch[1], 10) : 1;
          const formula = coeffMatch ? mol.slice(coeffMatch[1].length).trim() : mol;

          // Simple formula parser for common elements like H, C, O, Fe, Na, Cl, N, Cu, Zn, S, Ca, Mg
          const elemRegex = /([A-Z][a-z]?)(\d*)/g;
          let m: RegExpExecArray | null;
          while ((m = elemRegex.exec(formula)) !== null) {
            const elem = m[1];
            const num = m[2] ? parseInt(m[2], 10) : 1;
            counts[elem] = (counts[elem] || 0) + coeff * num;
          }
        }
        return counts;
      };

      const reactants = parseSide(parts[0]);
      const products = parseSide(parts[1]);

      const allElements = new Set([...Object.keys(reactants), ...Object.keys(products)]);
      let balanced = true;

      for (const el of allElements) {
        if ((reactants[el] || 0) !== (products[el] || 0)) {
          balanced = false;
          break;
        }
      }

      return {
        balanced,
        reactantCounts: reactants,
        productCounts: products,
      };
    } catch (e: any) {
      return { balanced: false, reactantCounts: {}, productCounts: {}, error: e.message };
    }
  }
}
