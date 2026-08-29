import { readFile } from 'node:fs/promises';

const GLOBAL_THRESHOLD = 90;
const PER_FILE_THRESHOLD = 80;
const COVERAGE_FILE = new URL('../coverage/coverage-final.json', import.meta.url);

const percentage = (covered, total) => (total === 0 ? 100 : (covered / total) * 100);

const summarizeHits = (hits) => ({
  covered: hits.filter((hit) => hit > 0).length,
  total: hits.length,
});

const getFileMetrics = (coverage) => {
  const lineHits = new Map();

  Object.entries(coverage.statementMap).forEach(([statementId, location]) => {
    const line = location.start.line;
    const hits = coverage.s[statementId];
    lineHits.set(line, Math.max(lineHits.get(line) ?? 0, hits));
  });

  return {
    statements: summarizeHits(Object.values(coverage.s)),
    branches: summarizeHits(Object.values(coverage.b).flat()),
    functions: summarizeHits(Object.values(coverage.f)),
    lines: summarizeHits([...lineHits.values()]),
  };
};

const mergeMetrics = (metrics) =>
  metrics.reduce(
    (total, current) => {
      Object.entries(current).forEach(([name, value]) => {
        total[name].covered += value.covered;
        total[name].total += value.total;
      });

      return total;
    },
    {
      statements: { covered: 0, total: 0 },
      branches: { covered: 0, total: 0 },
      functions: { covered: 0, total: 0 },
      lines: { covered: 0, total: 0 },
    },
  );

const formatMetric = ({ covered, total }) => percentage(covered, total).toFixed(2);

const reportFailure = (scope, name, metric, threshold) => {
  const actual = percentage(metric.covered, metric.total);

  if (actual >= threshold) {
    return false;
  }

  console.error(`${scope}: ${name} coverage ${actual.toFixed(2)}% is below ${threshold}%`);
  return true;
};

const coverage = JSON.parse(await readFile(COVERAGE_FILE, 'utf8'));
const files = Object.entries(coverage).map(([name, value]) => ({
  name,
  metrics: getFileMetrics(value),
}));
const globalMetrics = mergeMetrics(files.map((file) => file.metrics));
let hasFailure = false;

Object.entries(globalMetrics).forEach(([name, metric]) => {
  hasFailure = reportFailure('Global', name, metric, GLOBAL_THRESHOLD) || hasFailure;
});

files.forEach((file) => {
  Object.entries(file.metrics).forEach(([name, metric]) => {
    hasFailure = reportFailure(file.name, name, metric, PER_FILE_THRESHOLD) || hasFailure;
  });
});

if (hasFailure) {
  process.exitCode = 1;
} else {
  console.log(
    `Coverage verified: global >= ${GLOBAL_THRESHOLD}%, every file >= ${PER_FILE_THRESHOLD}%`,
  );
  console.log(
    Object.entries(globalMetrics)
      .map(([name, metric]) => `${name} ${formatMetric(metric)}%`)
      .join(', '),
  );
}
