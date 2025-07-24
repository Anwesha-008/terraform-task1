output "alb_dns_name" {
  value = module.alb.alb_dns_name
}

output "codepipeline_name" {
  value = module.codepipeline.pipeline_name
}

output "ecr_repository_url" {
  value = module.ecr.repository_url
}
output "codepipeline_artifacts_bucket" {
  value = module.s3.bucket_name
}
output "ecs_service_name" {
  value = module.ecs.ecs_service_name
}

output "ecs_cluster_name" {
  value = "${var.project_name}-ecs-cluster"
}
