<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep shared calendar calculations and task filtering in src/lib/planning.ts using date-fns, so all views agree on local calendar dates and weekly boundaries.
- Task editing, copies and reviews reuse the existing task actions and storage format; reviews are ordinary dated tasks so they appear in every planner view.
