variable "project_name" {
  type        = string
  description = "Name of the project"
}

variable "aws_region" {
  type        = string
  description = "AWS region"
}

variable "github_owner" {
  type        = string
  description = "GitHub username or organization"
}

variable "github_repo" {
  type        = string
  description = "GitHub repository name (not full URL)"
}

variable "github_branch" {
  type        = string
  description = "Branch to track in CodePipeline"
}

variable "github_oauth_token" {
  type        = string
  description = "GitHub token to authenticate CodePipeline"
}
