resource "aws_codepipeline" "pipeline" {
  name     = "${var.github_repo}-pipeline"
  role_arn = var.codepipeline_role_arn

  artifact_store {
    location = var.artifacts_bucket
    type     = "S3"
  }

  stage {
    name = "Source"
    action {
      name     = "Source"
      category = "Source"
      owner    = "ThirdParty"
      provider = "GitHub"
      version  = "1"
      output_artifacts = ["SourceOutput"]

      configuration = {
        Owner      = var.github_owner
        Repo       = var.github_repo
        Branch     = var.github_branch
        OAuthToken = var.github_oauth_token
      }
    }
  }

  stage {
    name = "Build"
    action {
      name     = "Build"
      category = "Build"
      owner    = "AWS"
      provider = "CodeBuild"
      input_artifacts = ["SourceOutput"]
      output_artifacts = ["BuildOutput"]
      version  = "1"

      configuration = {
        ProjectName = var.codebuild_project_name
      }
    }
  }
  stage {
    name = "Deploy"
    action {
      name     = "DeployToECS"
      category = "Deploy"
      owner    = "AWS"
      provider = "ECS"
      version  = "1"
      input_artifacts = ["BuildOutput"]

      configuration = {
        ClusterName = var.ecs_cluster_name
        ServiceName = var.ecs_service_name
        FileName    = var.imagedefinitions_file
      }
    }
  }
}
