import path from 'path';

export function belongsPage (fullPath: string, pages: string[] = []) {
  const file = path.parse(fullPath);
  return pages.indexOf(path.join(file.dir, file.name)) > -1;
};

export function belongsApp (fullPath: string, projectDir: string) {
  const file = path.parse(fullPath);
  const app = path.format({ dir: projectDir, name: 'app' });
  return app === path.join(file.dir, file.name);
};
