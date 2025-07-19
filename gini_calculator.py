#!/usr/bin/env python3
"""
Calculate Gini index for commit messages and contributors
"""
import subprocess
import sys
from collections import defaultdict

def run_git_command(cmd):
    """Run a git command and return the output"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding='utf-8')
        if result.returncode != 0:
            print(f"Error running command: {cmd}")
            print(f"Error: {result.stderr}")
            return None
        return result.stdout.strip()
    except Exception as e:
        print(f"Exception running command: {cmd}")
        print(f"Exception: {e}")
        return None

def get_commit_info():
    """Get all commits with their hash and message"""
    cmd = 'git log --pretty=format:"%H|%s"'
    output = run_git_command(cmd)
    if not output:
        return []
    
    commits = []
    for line in output.split('\n'):
        if '|' in line:
            hash_part, message = line.split('|', 1)
            commits.append({'hash': hash_part, 'message': message})
    
    return commits

def calculate_gini_from_counts(message_counts):
    """Calculate Gini coefficient from message count dictionary"""
    frequencies = list(message_counts.values())
    n = len(frequencies)
    total_commits = sum(frequencies)
    
    if n <= 1:
        return 0.0
    
    # Sort frequencies
    frequencies.sort()
    
    # Calculate Gini coefficient
    index = 0
    for i in range(n):
        index += (2 * (i + 1) - n - 1) * frequencies[i]
    
    return index / (n * total_commits)

def calculate_message_gini():
    """Calculate Gini index for commit message distribution"""
    commits = get_commit_info()

    if not commits:
        return 0.0

    # Count frequency of each commit message
    message_counts = {}
    for commit in commits:
        message = commit["message"]
        message_counts[message] = message_counts.get(message, 0) + 1

    gini = calculate_gini_from_counts(message_counts)
    
    print(f"=== COMMIT MESSAGE GINI INDEX ===")
    print(f"Total commits: {len(commits)}")
    print(f"Unique commit messages: {len(message_counts)}")
    print(f"Message Gini Index: {gini:.4f}")

    # Show distribution
    print(f"\n=== COMMIT MESSAGE DISTRIBUTION ===")
    sorted_messages = sorted(message_counts.items(), key=lambda x: x[1], reverse=True)
    for message, count in sorted_messages[:10]:  # Top 10
        percentage = (count / len(commits)) * 100
        print(f"{count:3d} ({percentage:5.1f}%) - {message[:60]}{'...' if len(message) > 60 else ''}")

    if len(sorted_messages) > 10:
        print(f"... and {len(sorted_messages) - 10} more unique messages")

    return gini

def calculate_contributor_gini():
    """Calculate Gini index for commit distribution among contributors"""
    # Get commit info with authors
    cmd = 'git log --pretty=format:"%an"'
    output = run_git_command(cmd)
    
    if not output:
        print("No commits found")
        return 0.0
    
    # Count commits per author
    author_commits = {}
    authors = output.split('\n')
    
    for author in authors:
        author = author.strip()
        if author:
            author_commits[author] = author_commits.get(author, 0) + 1
    
    if len(author_commits) <= 1:
        print("Only one contributor found")
        return 0.0
    
    # Calculate Gini coefficient for contributors
    commit_counts = list(author_commits.values())
    n = len(commit_counts)
    total_commits = sum(commit_counts)
    
    # Sort commit counts
    commit_counts.sort()
    
    # Calculate Gini coefficient
    index = 0
    for i in range(n):
        index += (2 * (i + 1) - n - 1) * commit_counts[i]
    
    gini = index / (n * total_commits)
    
    print(f"\n=== CONTRIBUTOR GINI INDEX ===")
    print(f"Total commits: {total_commits}")
    print(f"Number of contributors: {n}")
    print(f"Contributor Gini Index: {gini:.4f}")
    
    # Interpret the result
    if gini < 0.3:
        interpretation = "Very balanced - commits are evenly distributed"
    elif gini < 0.5:
        interpretation = "Moderately balanced - some inequality but acceptable"
    elif gini < 0.7:
        interpretation = "Unbalanced - significant inequality in contributions"
    else:
        interpretation = "Highly unbalanced - very unequal contributions"
    
    print(f"Interpretation: {interpretation}")
    
    # Show contributor distribution
    print(f"\n=== CONTRIBUTOR DISTRIBUTION ===")
    sorted_contributors = sorted(author_commits.items(), key=lambda x: x[1], reverse=True)
    
    for i, (author, count) in enumerate(sorted_contributors, 1):
        percentage = (count / total_commits) * 100
        print(f"{i:2d}. {author:<30} {count:4d} commits ({percentage:5.1f}%)")
    
    return gini

if __name__ == "__main__":
    if len(sys.argv) > 1:
        if sys.argv[1] == "messages":
            calculate_message_gini()
        elif sys.argv[1] == "contributors":
            calculate_contributor_gini()
        elif sys.argv[1] == "both":
            calculate_message_gini()
            calculate_contributor_gini()
        else:
            print("Usage: python gini_calculator.py [messages|contributors|both]")
    else:
        print("=== COMPREHENSIVE GINI ANALYSIS ===")
        calculate_message_gini()
        calculate_contributor_gini()
