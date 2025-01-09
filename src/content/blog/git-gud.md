---
title: "GitGud"
description: "A indepth dive into git and github"
publishedAt: 2025-01-09
tags: ["git", "github"]
---
# GIT GUD

## Introduction

Working in today's software development market often requires young devs to learn a lot of technologies so that they can work in a team. It won't just be enough for them to know how to code. You need to know `docker`, `git`, `circleci`, `a database engine` and so on and so on.

Most new devs have not yet had the pleasure of working with git nor working under a specific git-flow. I mean since you are working alone on your demo projects you might as well just push to master directly, not like it's gonna affect anyone. However, there does come a time in every developer's life where they need to learn `how to git`. To ease you into this world I would like to show you some of the most common git commands as well as a proper real-life example.

The term version control can be simplified.
In plain English, it means that we keep track of our changes while working.
Meaning we have a changelog documenting our changes, or prefix/suffix our files to keep track.

For example, let's say we have a file called `user.ts` which is our database user class. Over time we add to that file and we would like to keep track of the old code so we can go back to it in case something goes wrong. With that in mind, we would copy `user.ts` and have `user_old.ts` and `user.ts`.

So we have our old and new code. Next time we would have `user_old_old.ts`, `user_old.ts`, and `user.ts`. Now we can go back and use old code whenever we need it. One problem is we end up with too many files eventually. Changelogs are also a better way to have one file, but we would overload that poor file of ours with too many lines.

At first, there was no proper version control until Linus Torvalds stepped up and said, as you would to an expensive hooker, 'I will do it myself'. With that git was born.

Git tracks our changes in the background and stores all changes under their identifier allowing us to go from day one up to now trough our code changes and history and see what changed over time.

As noted before, however, we usually develop applications in teams. As nice as this all is we still need a computer to hold all the code as the central computer from which our team can pull, merge, push, etc. Here jump in online git hosting services which you have most likely heard of. GitHub, GitLab, Bitbucket are all online VCS-es allowing for centralized source code management.

I would like to point out that while git allows us to better collaborate it still has its share of problems and tedious ideas it brings. We now need to get our code review, fix conflicts from merges, take the time to commit, pull, and push our changes.

None the less it still is by far the most superior method to share our code, giving freedom for many open source projects to flourish.

## Terminology

- `Repository`: is a directory where your project/files are stored which are used to interact with git.

- `Remote branch/repository`: in git, if we have a remote server, which in most cases is GitHub for example, we refer to all the repositories and branches there as remote.

- `Local branch/repository`: are all the repositories and branches in those repositories located on the local machine we work on

- `Branch`: is a collection of commits that are all linked in sequential order. Whenever we commit we extend that branch and whenever we create a new branch we simply copy the previous commit history to it and then develop on those branches individually

- `Master branch`: is the name of the main branch. All commits get eventually added to that branch and its the branch used for deployment

- `Feature branch`: a branch we made to implement our new feature. From this branch, we open a pull request so the changes get added to the master branch


## The commands

The magic behind git is the plethora of commands it provides. There are many to name a few.
In our daily work, we end up using only most of them luckily.

### Lets go over the most common commands we use:

- `init`: initialize your current directory as the root of the git project. From that directory downwards all files will be tracked.

- `clone`: clone a remote repository locally with all the previous commits.

- `status`: allows us to view the current status of our branch. We can see files staged for commit, pending files, and untracked files. It should be by far the most typed git command since we need to track when and what we are committing. It's good to carry a pitch of paranoia and often use this command.

- `add`: simply adds a file or files to be staged for commit. Once we are done with a file and want to include it in the commit we simply add it and proceed to commit. The command can be used with `.` and `-A` to add all files or multiple files at once

- `rm`: remove a staged file. It does the opposite of add.

- `commit`: is the command that commits changes to our file. Commit is accompanied by the `-m` flag which allows us to give our commit a semantic message so other developers know what we did. Every run of the commit command generates a unique id by `git` using `SHA256` hash to identify changes related to it.

- `push`: allows us to push commit/s to a remote repository branch. Usually, once we are done with a feature we would push our changes to a remote branch on GitHub or GitLab and open a pull request.

- `pull`: allows us to pull in changes (which are commit/s) from a remote repository branch. When working in a team, other developers will have their contributions which they will push to our repository and when that happens we should pull them into our local to keep git's commit history intact.

- `checkout`: allows us to move between branches. Want to go from one branch to another. Just checkout to it.

- `branch`: can be used to manipulate branches. With different flags, we can create or delete branches. The command itself lists all branches in our project, `-D or -d` will remove a branch, or if we add a name after the command it will create the branch from the branch we are currently on. Note that `git branch <name>` will only create the branch, it will not set it active. We need to manually checkout to that branch. A quick alternative would be `git checkout -b <name>` which creates and changes to the newly created branch

- `merge`: merges two branches. What is more specifically does is merge the commit histories of the two branches into one branch containing all commits. This means we can only merge branches that share a commit history. This often causes so-called `merge conflicts` that developers need to resolve.

- `rebase`: while working in a team often our team members will add commits to our master branch. Once we pull that branch into our local we will find that master has now a lot more commits that initially when we created our feature branch. With rebase, we can add all those new changes on the master to our feature branch so we don't run into merge conflicts when we open a pull request.

- `reset`: revert your branch to a previous state. This would be like going back in time on your commits undoing all the changes you did.

- `remote`: manipulate remote repositories. This is mostly used to add a remote repository from GitHub or GitLab so that you can push to it later.

Other commands you could use for git are `diff`, `update-index`, `config`, `stash`, `log`.


## Working in a team

When working in a team we need to know how to use git to collaborate and clear tasks. 
It's a pretty good idea to have a branch for an issue so that we can draw relation from issues to PR to branch.

Branches should follow a pattern when naming them, for which I recommend [convential commits](https://www.conventionalcommits.org/en/v1.0.0/).

Instead of me mansplaining how to use commands all around, let's have a hands-on example.

The situation is as follows:
- We have 3 issues on GitHub
- 2 developers are working on a project
- There are some previous commits on our project

We will call one developer John and the other Ada. 
At first, what they did was both pull their master branch as follows:

`git pull origin master`

I mentioned that pull will take all commits from a remote repository and apply them locally. The word `origin` is a custom given name to the remote repository on GitHub and `master` is the name of the branch we want to pull.

So with that in mind, both of their commit histories look like this.

`John's and Ada's commit history`
``` 
A---B---C---D  // master
```

So they have 4 commits on their master branch. Now each one of them will create a branch and start working on their feature.

John uses the following command: `git checkout -b 1-feat/logging`. This will create a branch named `1-feat/logging` and set it as active. Notice how John uses standardized naming for his branch. Good job John.

Ada runs the following commands: `git branch 2-fix/get-user-bug && git checkout 2-fix/get-user-bug`. Ada likes to first create a branch and then checkout to it.

Their commit-tree now looks like this

`John`
```
              E // 1-feat/logging
             /
A---B---C---D  // master
```

`Ada`
```
              F // 2-fix/get-user-bug
             /
A---B---C---D  // master
```

We see they have two new branches with different commit ids.

Now they both work on their code and finish up the issue. Ada is a bit faster and is first to push to her branch.
She uses the commands:
```
git add .
git commit -m "fix(user): repository logic"
git push origin 2-fix/get-user-bug
```
Now what Ada did is add her files fo committing, then committing those files with a message and pushing to the branch `2-fix/get-user-bug`. This branch does not exist on GitHub, but the push command will create it. Once that passes she opens a pull request, gets it reviewed, approved, and merged. After all that she uses
`git pull origin master` again to pull the new commit locally.

Her commit history now looks like this.

`Ada`
```
              F // 2-fix/get-user-bug
             /
A---B---C---D---F  // master
```

`Remote`

```
              F // 2-fix/get-user-bug
             /
A---B---C---D---F  // master
```

We see git has added her commit to the main branch and now we can deploy the feature.
However, in the meantime, John has also completed his feature. There is but one problem now. John does not have the commit F in his history. If he tried to open a pull request he would get a merge conflict and we want to avoid that on pull requests.

Let's take a look at John's git tree

`John`
```
              E // 1-feat/logging
             /
A---B---C---D  // master
```

`Remote`

```
              F // 2-fix/get-user-bug
             /
A---B---C---D---F  // master
```

Now John knows what he has to do. He will pull the changes with `git pull origin master`


`John`
```
              E // 1-feat/logging
             /
A---B---C---D---F  // master
```

`Remote`

```
              F // 2-fix/get-user-bug
             /
A---B---C---D---F  // master
```

Ok now John has also commit F, but there is still a problem. We can still run into a merge conflict since Jonh's feature branch does not know of the commit F. Not to worry though, John knows how to handle this. He is going to do a `rebase` on his branch. This will add all new commits missing from his feature history from the master branch.

Having pulled from master John does the following: `git rebase master`

Now git will begin rewriting the commit history, and what do you know John has a merge conflict mid-rebase.
You know you have a merge conflict when you see:

```
<<<<HEAD
====
>>>>
```

John calls Ada so they figure out what code he should keep or remove and fix the issues. What John does next is first rebase and then continue, so he types:

```
git add .
git rebase --continue
```

The add command stages the changes to be applied and continues to run rebase. After everything is done John now has the following tree:


`John`
```
                  E // 1-feat/logging
                 /
A---B---C---D---F  // master
```

So we see it went from

`John`                                     
```
              E // 1-feat/logging                                  E // 1-feat/logging
             /                                                    /
A---B---C---D---F  // master           to        A---B---C---D---F  // master
```

We see git has altered the history to say that John's branch has been created from F instead of D. Now we should not have any merge conflicts when opening a PR.

John opens a PR and merges his changes into master. In the meantime, Ada started working on issue 3 on her branch `3-perf/optimize-db`. She repeats the process of rebasing.

Now we have the following git trees for each individual

`Remote`

```
              F // 2-fix/get-user-bug
             /
A---B---C---D---F---E  // master
                 \
                  E // 1-feat/logging
```

`John`
```
                  E // 1-feat/logging
                 /
A---B---C---D---F---E  // master
```

`Ada`
```
Before rebase                                                   After rebase
              F // 2-fix/get-user-bug                                         F // 2-fix/get-user-bug
             /                                                               /
A---B---C---D---F---E  // master                                    A---B---C---D---F---E  // master
                 \                                                                       \
                  G // 3-perf/optimize-db                                                 G // 3-perf/optimize-db
```

Now Ada opens the last PR which gets merged and we have completed our example and all tasks at hand.

## Common mistakes and how to fix them

- Pulling master branch added now commits and master is now all sorts of messed up

    This is something that happens often, whether we like to admit it or not. There is a simple solution for this, even though it may seem a bit hacky. Since `git pull` is a combination of 2 commands `fetch and merge` we know that `merge` is what causes an issue. When git does pull it first fetches the remote branch into `remote/origin/master` (where origin can be any remote host, and master any branch we pull). It then merges the remote with our local branch, usually using no-fast-forward adding a merge commit on top of our commit.

    To solve this we can:

    a) use `git log --oneline` to list all commits in the branch. There we can see to which commit we want to go back aka the commit before fuck up. We copy the `SHA (commit id)` and use `git reset --hard <SHA>` to return to the previous commit fully. After that we use `git pull` again with `--ff` flag `(git pull origin master --ff)`. This should properly pull from master and we can continue to work.

    b) first checkout to a temporary branch with `git checkout -b some_random_branch`. From there we remove our `master` branch with `git branch -D master`. Since master is broken we remove it locally so we can refetch it. As mentioned pull does fetch and merge and it's the merge part that breaks our local branch. So we just won't use it. Instead, since we removed the local master branch, we execute `git fetch origin master:master`. This fetches our remote master and creates a local branch named master with the same commit history aka the proper commit history.

- Restore files from staged or commit.

    We sometimes add files to staged which we do not want to commit. Git provides a revert command by default. When we type `git status` we get the following output:

    ```
    On branch master
    Changes to be committed:
    (use "git reset HEAD <file>..." to unstage) <=======

    modified:   index.js

    Changes not staged for commit:
    (use "git add <file>..." to update what will be committed)
    (use "git checkout -- <file>..." to discard changes in working directory) <=======

    modified:   readme.md
    ```
    We see that git shows us which commands we need to execute to remove files from staged and modified list. On some versions of git you would use `checkout` and `reset`, others would show `restore --staged` and `restore`.

    If we want to return a file to a previous state from a previous commit we can use:
    `git checkout <SHA> -- file`. This reverts the file to the state it was in from the provided commit id.

## Where to from here?

Now that you are very familiar with git, and a pro at working in a team, what would be your next steps?

The best first step would be to integrate a git-flow into your private projects where you work alone, to get a better feel for it. In other words, just use it since practice makes perfect.

Aside from that, you could show your teammates how to use git and incorporate a proper flow in your projects.

If in case you need some references you can always consult:

- https://gist.github.com/forest/19fc774dde34f77e2540 (for a good reference of git-flow)

- https://www.conventionalcommits.org/en/v1.0.0/ (how to write commit messages and name branches)

- https://git-scm.com/docs (official git docs)