resource "aws_codebuild_project" "main" {
  name          = "${var.project_name}-codebuild"
  service_role  = var.codebuild_role_arn
  artifacts {
    type            = "S3"
    location        = var.artifacts_bucket
    packaging       = "ZIP"
    path            = "codebuild-artifacts"
    name            = "build-output.zip"
    namespace_type  = "BUILD_ID"
  }
  environment {
    compute_type                = "BUILD_GENERAL1_SMALL"
    image                       = "aws/codebuild/standard:6.0"
    type                        = "LINUX_CONTAINER"
    privileged_mode             = true
    environment_variable {
      name  = "REPOSITORY_URI"
      value = var.ecr_repo_url
    }
  }
  source {
    type            = "GITHUB"
    location        = "https://github.com/${var.github_owner}/${var.github_repo}.git"
    git_clone_depth = 1
    buildspec       = "frontend/buildspec.yml"
  }
}
