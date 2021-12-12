import { Command } from 'commander';

export default function launch(program: Command): void {
  program
    .command('launch')
    .description('launches a new dev environment')
    .action(() => {
      console.log('in launch');
    });
}
