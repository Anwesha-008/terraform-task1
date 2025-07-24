variable "github_repo" {
  type = string
}

variable "github_owner" {
  type = string
}

variable "github_branch" {
  type = string
}

variable "github_oauth_token" {
  type = string
}

variable "codebuild_project_name" {
  type = string
}

variable "ecs_cluster_name" {
  type = string
}

variable "ecs_service_name" {
  type = string
}

variable "imagedefinitions_file" {
  type = string
}
#variable "terratest_project_name" {
# type = string
#}
variable "codepipeline_role_arn" {
  type = string
}
variable "artifacts_bucket" {
  type        = string
  description = "S3 bucket for CodePipeline artifacts"
}
