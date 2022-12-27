using Amazon.Runtime.Internal.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.Diagnostics;
using Sabio.Models.Requests.Diagnostics;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/diagnostics")]
    [ApiController]
    public class DiagnosticApiController : BaseApiController
    {
        private IDiagnosticService _service = null;
        private IAuthenticationService<int> _authService = null;

        public DiagnosticApiController(IDiagnosticService service,
            ILogger<DiagnosticApiController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> CreateV2(DiagnosticAddRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int id = _service.AddV2(model, userId);
                ItemResponse<int> response = new ItemResponse<int>() { Item = id };
                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse($"Generic Errors: ${ex.Message}");
                result = StatusCode(500, response);
            }
            return result;
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(DiagnosticUpdateRequest model)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.Update(model, userId);

                SuccessResponse response = new SuccessResponse();

                return Ok(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());

                ErrorResponse response = new ErrorResponse($"Generic Errors: ${ex.Message}");
            }
            return result;
        }

        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<BaseDiagnostic>> GetById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                BaseDiagnostic diagnostic = _service.GetById(id);

                if (diagnostic == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Diagnostic not found");
                    return NotFound404(response);
                }
                else
                {
                    response = new ItemResponse<BaseDiagnostic> { Item = diagnostic };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: ${ex.Message}");

            }
            return StatusCode(iCode, response);
        }


        [HttpGet("practice/{id:int}")]
        public ActionResult<ItemsResponse<Diagnostic>> GetByPracticeId(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                List<Diagnostic> diagnostic = _service.GetByPracticeId(id);

                if (diagnostic == null)
                {
                    iCode = 404;
                    response = new ErrorResponse("Diagnostic not found");
                    return NotFound404(response);
                }
                else
                {
                    response = new ItemsResponse<Diagnostic> { Items = diagnostic };
                }
            }
            catch (Exception ex)
            {
                iCode = 500;
                Logger.LogError(ex.ToString());
                response = new ErrorResponse($"Generic Errors: ${ex.Message}");

            }
            return StatusCode(iCode, response);
        }


        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<BaseDiagnostic>>> SearchPaginationByHorseId(int pageIndex, int pageSize, int query)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<BaseDiagnostic> page = _service.SearchPaginationByHorseId(pageIndex, pageSize, query);
                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("HorseProfileId Not Found");
                }
                else
                {
                    response = new ItemResponse<Paged<BaseDiagnostic>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }

        [HttpPut("archived/{id:int}/{isArchived:bool}")]
        public ActionResult<SuccessResponse> UpdateIsArchived(int id, bool isArchived)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                _service.UpdateIsArchived(id, userId, isArchived);

                response = new SuccessResponse();

            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                Logger.LogError(ex.ToString());

            }
            return StatusCode(code,response);
        }
 

    }
}
