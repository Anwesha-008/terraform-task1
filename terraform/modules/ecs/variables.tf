variable "alb_listener_arn" {
  type = string
}

variable "ecr_repo_url" {
  type = string
}

variable "ecs_task_role_arn" {
  type = string
}

variable "ecs_execution_role_arn" {
  type = string
}

variable "cluster_name" {
  type = string
}

variable "subnet_ids" {
  type = list(string)
}

variable "security_group_id" {
  type = string
}

variable "project_name" {
  type = string
}

variable "vpc_id" {
  type = string
}
