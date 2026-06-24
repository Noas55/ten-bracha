import json
import logging
from typing import List, Optional

from datetime import datetime, date

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.foods import FoodsService

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/foods", tags=["foods"])


# ---------- Pydantic Schemas ----------
class FoodsData(BaseModel):
    """Entity data schema (for create/update)"""
    food_name: str
    category: str
    tradition: str
    first_blessing: str
    last_blessing: str
    note: str = None
    requires_clarification: bool = None


class FoodsUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    food_name: Optional[str] = None
    category: Optional[str] = None
    tradition: Optional[str] = None
    first_blessing: Optional[str] = None
    last_blessing: Optional[str] = None
    note: Optional[str] = None
    requires_clarification: Optional[bool] = None


class FoodsResponse(BaseModel):
    """Entity response schema"""
    id: int
    food_name: str
    category: str
    tradition: str
    first_blessing: str
    last_blessing: str
    note: Optional[str] = None
    requires_clarification: Optional[bool] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FoodsListResponse(BaseModel):
    """List response schema"""
    items: List[FoodsResponse]
    total: int
    skip: int
    limit: int


class FoodsBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[FoodsData]


class FoodsBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: FoodsUpdateData


class FoodsBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[FoodsBatchUpdateItem]


class FoodsBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=FoodsListResponse)
async def query_foodss(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Query foodss with filtering, sorting, and pagination"""
    logger.debug(f"Querying foodss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = FoodsService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")
        
        result = await service.get_list(
            skip=skip, 
            limit=limit,
            query_dict=query_dict,
            sort=sort,
        )
        logger.debug(f"Found {result['total']} foodss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying foodss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=FoodsListResponse)
async def query_foodss_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query foodss with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying foodss: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = FoodsService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")

        result = await service.get_list(
            skip=skip,
            limit=limit,
            query_dict=query_dict,
            sort=sort
        )
        logger.debug(f"Found {result['total']} foodss")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying foodss: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=FoodsResponse)
async def get_foods(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Get a single foods by ID"""
    logger.debug(f"Fetching foods with id: {id}, fields={fields}")
    
    service = FoodsService(db)
    try:
        result = await service.get_by_id(id)
        if not result:
            logger.warning(f"Foods with id {id} not found")
            raise HTTPException(status_code=404, detail="Foods not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching foods {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=FoodsResponse, status_code=201)
async def create_foods(
    data: FoodsData,
    db: AsyncSession = Depends(get_db),
):
    """Create a new foods"""
    logger.debug(f"Creating new foods with data: {data}")
    
    service = FoodsService(db)
    try:
        result = await service.create(data.model_dump())
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create foods")
        
        logger.info(f"Foods created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating foods: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating foods: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[FoodsResponse], status_code=201)
async def create_foodss_batch(
    request: FoodsBatchCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create multiple foodss in a single request"""
    logger.debug(f"Batch creating {len(request.items)} foodss")
    
    service = FoodsService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump())
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} foodss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[FoodsResponse])
async def update_foodss_batch(
    request: FoodsBatchUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Update multiple foodss in a single request"""
    logger.debug(f"Batch updating {len(request.items)} foodss")
    
    service = FoodsService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict)
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} foodss successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=FoodsResponse)
async def update_foods(
    id: int,
    data: FoodsUpdateData,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing foods"""
    logger.debug(f"Updating foods {id} with data: {data}")

    service = FoodsService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict)
        if not result:
            logger.warning(f"Foods with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Foods not found")
        
        logger.info(f"Foods {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating foods {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating foods {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_foodss_batch(
    request: FoodsBatchDeleteRequest,
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple foodss by their IDs"""
    logger.debug(f"Batch deleting {len(request.ids)} foodss")
    
    service = FoodsService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id)
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} foodss successfully")
        return {"message": f"Successfully deleted {deleted_count} foodss", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_foods(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete a single foods by ID"""
    logger.debug(f"Deleting foods with id: {id}")
    
    service = FoodsService(db)
    try:
        success = await service.delete(id)
        if not success:
            logger.warning(f"Foods with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Foods not found")
        
        logger.info(f"Foods {id} deleted successfully")
        return {"message": "Foods deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting foods {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")