variable "project_name" {
  type = string
}

variable "github_repo" {
  type = string
}

variable "github_owner" {
  type = string
}

variable "github_oauth_token" {
  type = string
}

variable "ecr_repo_url" {
  type = string
}
variable "codebuild_role_arn" {
  type = string
}
variable "artifacts_bucket" {
  type        = string
  description = "S3 bucket name for storing build artifacts"
}
