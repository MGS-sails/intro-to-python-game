/* Pyodide Web Worker — runs Python code in isolation */
importScripts('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js');

let pyodide = null;

async function init() {
  pyodide = await loadPyodide();
  self.postMessage({ type: 'ready' });
}

init().catch(err => {
  self.postMessage({ type: 'init_error', message: err.message });
});

self.onmessage = async (event) => {
  const { type, id, code, testsJson } = event.data;
  if (type !== 'run') return;

  if (!pyodide) {
    self.postMessage({ type: 'result', id, error: 'Python runtime not ready yet.', stdout: '', testResults: [] });
    return;
  }

  try {
    pyodide.globals.set('_student_code', code);
    pyodide.globals.set('_tests_json', testsJson);

    const resultJson = pyodide.runPython(`
import sys, io, json, traceback as _tb

_buf = io.StringIO()
sys.stdout = _buf
sys.stderr = _buf

_ns = {}
_error = None

try:
    exec(_student_code, _ns)
except Exception as _e:
    _error = _tb.format_exc()
finally:
    _stdout = _buf.getvalue()
    sys.stdout = sys.__stdout__
    sys.stderr = sys.__stderr__

_tests = json.loads(_tests_json)
_results = []

if _error is None:
    _ns['_ns'] = _ns
    _ns['_stdout'] = _stdout
    for _t in _tests:
        _tns = dict(_ns)
        try:
            exec(_t['testCode'], _tns)
            _results.append({'description': _t['description'], 'passed': True, 'message': ''})
        except AssertionError as _ae:
            _results.append({'description': _t['description'], 'passed': False, 'message': str(_ae)})
        except Exception as _te:
            _results.append({'description': _t['description'], 'passed': False, 'message': f'Test error: {_te}'})

json.dumps({'stdout': _stdout, 'error': _error, 'testResults': _results})
`);

    const result = JSON.parse(resultJson);
    result.id = id;
    result.allPassed = !result.error && result.testResults.every(t => t.passed);
    self.postMessage({ type: 'result', ...result });
  } catch (err) {
    self.postMessage({ type: 'result', id, error: err.message, stdout: '', testResults: [] });
  }
};
