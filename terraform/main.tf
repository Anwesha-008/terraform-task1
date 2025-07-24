terraform {
  required_version = ">= 1.3.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source       = "./modules/vpc"
  project_name = var.project_name
}

module "alb" {
  source         = "./modules/alb"
  vpc_id         = module.vpc.vpc_id
  public_subnets = module.vpc.public_subnets
  project_name   = var.project_name
}

module "ecr" {
  source       = "./modules/ecr"
  project_name = var.project_name
}

module "iam" {
  source       = "./modules/iam"
  project_name = var.project_name
}

module "ecs" {
  source                   = "./modules/ecs"
  alb_listener_arn         = module.alb.listener_arn
  ecr_repo_url             = module.ecr.repository_url
  ecs_task_role_arn        = module.iam.ecs_task_role_arn
  ecs_execution_role_arn   = module.iam.ecs_execution_role_arn
  cluster_name             = "${var.project_name}-ecs-cluster"
  vpc_id                   = module.vpc.vpc_id
  subnet_ids               = module.vpc.public_subnets
  security_group_id        = module.alb.security_group_id
  project_name             = var.project_name
}

module "codebuild" {
  source             = "./modules/codebuild"
  project_name       = var.project_name
  github_repo        = var.github_repo
  github_owner       = var.github_owner
  github_oauth_token = var.github_oauth_token
  ecr_repo_url       = module.ecr.repository_url
  codebuild_role_arn = module.iam.codebuild_role_arn
  artifacts_bucket   = module.s3.bucket_name
}

module "codepipeline" {
  source                   = "./modules/codepipeline"
  github_repo              = var.github_repo
  github_owner             = var.github_owner
  github_branch            = var.github_branch
  github_oauth_token       = var.github_oauth_token
  codebuild_project_name   = module.codebuild.codebuild_project_name
  ecs_cluster_name         = "${var.project_name}-ecs-cluster"
  ecs_service_name         = module.ecs.ecs_service_name
  imagedefinitions_file    = "imagedefinitions.json"
  #terratest_project_name   = module.codebuild.terratest_project_name
  codepipeline_role_arn = module.iam.codepipeline_role_arn
  artifacts_bucket         = module.s3.bucket_name
}
module "s3" {
  source       = "./modules/s3"
  project_name = var.project_name
}
